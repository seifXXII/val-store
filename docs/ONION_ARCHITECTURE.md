# Onion Architecture Guide

## 🎯 Overview

Onion Architecture organizes code in concentric layers, with business logic at the center and external concerns at the edges. Dependencies point **inward** - outer layers can depend on inner layers, but **never the reverse**.

```
┌─────────────────────────────────────────┐
│     PRESENTATION LAYER (UI/API)         │  ← Outermost
├─────────────────────────────────────────┤
│     INFRASTRUCTURE LAYER                │
├─────────────────────────────────────────┤
│     APPLICATION LAYER (Use Cases)       │
├─────────────────────────────────────────┤
│     DOMAIN LAYER (Business Logic)       │  ← Core/Innermost
└─────────────────────────────────────────┘
```

---

## 📁 Project Structure

```
src/
├── domain/                                 # LAYER 1: CORE (No dependencies)
│   ├── entities/                           # Business entities
│   ├── value-objects/                      # Immutable value objects
│   ├── interfaces/                         # Contracts/abstractions
│   └── exceptions/                         # Domain-specific errors
│
├── application/                            # LAYER 2: Use Cases
│   ├── use-cases/                          # Business use cases
│   ├── dtos/                               # Data Transfer Objects
│   ├── mappers/                            # Entity ↔ DTO converters
│   └── validators/                         # Input validation
│
├── infrastructure/                         # LAYER 3: External concerns
│   ├── database/                           # Database implementations
│   ├── repositories/                       # Repository implementations
│   ├── services/                           # External service clients
│   └── config/                             # Configuration
│
└── presentation/                           # LAYER 4: Entry points
    ├── api/                                # API layer (tRPC)
    └── web/                                # Web UI (Next.js)
```

---

## 🔷 Layer 1: Domain Layer (Core)

**Location:** `src/domain/`

**Purpose:** Contains pure business logic. No external dependencies. This is the heart of your application.

**Rules:**

- ✅ No imports from other layers
- ✅ No framework dependencies
- ✅ Pure TypeScript/JavaScript
- ✅ Only business rules and logic

### 1.1 Entities

**Location:** `src/domain/entities/`

**Naming Convention:** `[EntityName].entity.ts`

```typescript
// src/domain/entities/user.entity.ts
export class UserEntity {
  constructor(
    public readonly id: string,
    public readonly email: string,
    public readonly firstName: string,
    public readonly lastName: string,
    public readonly role: UserRole,
    public readonly isActive: boolean,
    public readonly emailVerified: boolean,
    public readonly createdAt: Date,
    public readonly updatedAt: Date,
    public readonly lastLogin?: Date
  ) {}

  // Business logic methods
  isAdmin(): boolean {
    return this.role === "admin" || this.role === "super_admin";
  }

  canAccessAdminPanel(): boolean {
    return this.isAdmin() && this.isActive;
  }

  getFullName(): string {
    return `${this.firstName} ${this.lastName}`;
  }

  hasVerifiedEmail(): boolean {
    return this.emailVerified;
  }
}

export type UserRole = "customer" | "admin" | "super_admin";
```

```typescript
// src/domain/entities/product.entity.ts
export class ProductEntity {
  constructor(
    public readonly id: string,
    public readonly name: string,
    public readonly slug: string,
    public readonly description: string,
    public readonly basePrice: number,
    public readonly salePrice: number | null,
    public readonly categoryId: string | null,
    public readonly isActive: boolean,
    public readonly isFeatured: boolean,
    public readonly createdAt: Date,
    public readonly updatedAt: Date
  ) {}

  // Business logic
  getCurrentPrice(): number {
    return this.salePrice ?? this.basePrice;
  }

  isOnSale(): boolean {
    return this.salePrice !== null && this.salePrice < this.basePrice;
  }

  getDiscountPercentage(): number {
    if (!this.isOnSale()) return 0;
    return Math.round(
      ((this.basePrice - this.salePrice!) / this.basePrice) * 100
    );
  }

  canBePurchased(): boolean {
    return this.isActive;
  }
}
```

### 1.2 Value Objects

**Location:** `src/domain/value-objects/`

**Naming Convention:** `[ValueObjectName].value-object.ts`

Value objects are immutable and validated.

```typescript
// src/domain/value-objects/email.value-object.ts
export class EmailValueObject {
  private readonly value: string;

  constructor(email: string) {
    if (!this.isValidEmail(email)) {
      throw new Error("Invalid email address");
    }
    this.value = email.toLowerCase().trim();
  }

  private isValidEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

  getValue(): string {
    return this.value;
  }

  getDomain(): string {
    return this.value.split("@")[1];
  }

  equals(other: EmailValueObject): boolean {
    return this.value === other.value;
  }
}
```

```typescript
// src/domain/value-objects/password.value-object.ts
export class PasswordValueObject {
  private readonly value: string;

  private constructor(value: string) {
    this.value = value;
  }

  static create(plainTextPassword: string): PasswordValueObject {
    if (plainTextPassword.length < 8) {
      throw new Error("Password must be at least 8 characters");
    }
    if (!/[A-Z]/.test(plainTextPassword)) {
      throw new Error("Password must contain at least one uppercase letter");
    }
    if (!/[a-z]/.test(plainTextPassword)) {
      throw new Error("Password must contain at least one lowercase letter");
    }
    if (!/[0-9]/.test(plainTextPassword)) {
      throw new Error("Password must contain at least one number");
    }
    return new PasswordValueObject(plainTextPassword);
  }

  getValue(): string {
    return this.value;
  }
}
```

### 1.3 Interfaces (Repository Contracts)

**Location:** `src/domain/interfaces/repositories/`

**Naming Convention:** `[EntityName].repository.interface.ts`

```typescript
// src/domain/interfaces/repositories/user.repository.interface.ts
import { UserEntity } from "@/domain/entities/user.entity";
import { EmailValueObject } from "@/domain/value-objects/email.value-object";

export interface UserRepositoryInterface {
  findById(userId: string): Promise<UserEntity | null>;
  findByEmail(email: EmailValueObject): Promise<UserEntity | null>;
  findAll(): Promise<UserEntity[]>;
  create(user: UserEntity): Promise<UserEntity>;
  update(user: UserEntity): Promise<UserEntity>;
  delete(userId: string): Promise<void>;
  existsByEmail(email: EmailValueObject): Promise<boolean>;
}
```

```typescript
// src/domain/interfaces/repositories/product.repository.interface.ts
import { ProductEntity } from "@/domain/entities/product.entity";

export interface ProductRepositoryInterface {
  findById(productId: string): Promise<ProductEntity | null>;
  findBySlug(slug: string): Promise<ProductEntity | null>;
  findAll(filters?: ProductFilters): Promise<ProductEntity[]>;
  findByCategory(categoryId: string): Promise<ProductEntity[]>;
  create(product: ProductEntity): Promise<ProductEntity>;
  update(product: ProductEntity): Promise<ProductEntity>;
  delete(productId: string): Promise<void>;
}

export interface ProductFilters {
  isActive?: boolean;
  isFeatured?: boolean;
  categoryId?: string;
}
```

### 1.4 Domain Exceptions

**Location:** `src/domain/exceptions/`

**Naming Convention:** `[ExceptionName].exception.ts`

```typescript
// src/domain/exceptions/user-not-found.exception.ts
export class UserNotFoundException extends Error {
  constructor(identifier: string) {
    super(`User not found with identifier: ${identifier}`);
    this.name = "UserNotFoundException";
  }
}
```

```typescript
// src/domain/exceptions/invalid-credentials.exception.ts
export class InvalidCredentialsException extends Error {
  constructor() {
    super("Invalid email or password");
    this.name = "InvalidCredentialsException";
  }
}
```

---

## 🔶 Layer 2: Application Layer

**Location:** `src/application/`

**Purpose:** Orchestrates domain entities and coordinates application logic. Contains use cases.

**Rules:**

- ✅ Can import from domain layer
- ✅ No imports from infrastructure or presentation
- ✅ Use interfaces, not implementations

### 2.1 Use Cases

**Location:** `src/application/use-cases/`

**Naming Convention:** `[ActionName].use-case.ts`

```typescript
// src/application/use-cases/auth/signup-user.use-case.ts
import { UserEntity } from "@/domain/entities/user.entity";
import { UserRepositoryInterface } from "@/domain/interfaces/repositories/user.repository.interface";
import { EmailValueObject } from "@/domain/value-objects/email.value-object";
import { PasswordValueObject } from "@/domain/value-objects/password.value-object";
import { PasswordHasherInterface } from "@/application/interfaces/password-hasher.interface";

export class SignupUserUseCase {
  constructor(
    private readonly userRepository: UserRepositoryInterface,
    private readonly passwordHasher: PasswordHasherInterface
  ) {}

  async execute(input: SignupUserInput): Promise<SignupUserOutput> {
    // Validate email
    const emailValueObject = new EmailValueObject(input.email);

    // Check if user already exists
    const existingUser = await this.userRepository.findByEmail(
      emailValueObject
    );
    if (existingUser) {
      throw new Error("User with this email already exists");
    }

    // Validate and hash password
    const passwordValueObject = PasswordValueObject.create(input.password);
    const hashedPassword = await this.passwordHasher.hash(
      passwordValueObject.getValue()
    );

    // Create user entity
    const newUser = new UserEntity(
      crypto.randomUUID(), // Or use a proper ID generator
      emailValueObject.getValue(),
      input.firstName,
      input.lastName,
      "customer",
      true,
      false,
      new Date(),
      new Date()
    );

    // Save to repository
    const createdUser = await this.userRepository.create(newUser);

    return {
      userId: createdUser.id,
      email: createdUser.email,
      fullName: createdUser.getFullName(),
    };
  }
}

export interface SignupUserInput {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
}

export interface SignupUserOutput {
  userId: string;
  email: string;
  fullName: string;
}
```

```typescript
// src/application/use-cases/auth/login-user.use-case.ts
import { UserRepositoryInterface } from "@/domain/interfaces/repositories/user.repository.interface";
import { EmailValueObject } from "@/domain/value-objects/email.value-object";
import { PasswordHasherInterface } from "@/application/interfaces/password-hasher.interface";
import { InvalidCredentialsException } from "@/domain/exceptions/invalid-credentials.exception";

export class LoginUserUseCase {
  constructor(
    private readonly userRepository: UserRepositoryInterface,
    private readonly passwordHasher: PasswordHasherInterface
  ) {}

  async execute(input: LoginUserInput): Promise<LoginUserOutput> {
    // Find user by email
    const emailValueObject = new EmailValueObject(input.email);
    const user = await this.userRepository.findByEmail(emailValueObject);

    if (!user) {
      throw new InvalidCredentialsException();
    }

    // Verify password
    const isPasswordValid = await this.passwordHasher.compare(
      input.password,
      user.passwordHash
    );

    if (!isPasswordValid) {
      throw new InvalidCredentialsException();
    }

    // Check if account is active
    if (!user.isActive) {
      throw new Error("Your account has been deactivated");
    }

    // Update last login (would use a separate use case in production)
    // await this.userRepository.update({ ...user, lastLogin: new Date() });

    return {
      userId: user.id,
      email: user.email,
      fullName: user.getFullName(),
      role: user.role,
    };
  }
}

export interface LoginUserInput {
  email: string;
  password: string;
}

export interface LoginUserOutput {
  userId: string;
  email: string;
  fullName: string;
  role: string;
}
```

### 2.2 DTOs (Data Transfer Objects)

**Location:** `src/application/dtos/`

**Naming Convention:** `[EntityName].dto.ts`

```typescript
// src/application/dtos/user.dto.ts
export class UserDto {
  constructor(
    public readonly id: string,
    public readonly email: string,
    public readonly firstName: string,
    public readonly lastName: string,
    public readonly role: string,
    public readonly isActive: boolean,
    public readonly emailVerified: boolean,
    public readonly createdAt: Date
  ) {}
}

export class CreateUserDto {
  constructor(
    public readonly email: string,
    public readonly password: string,
    public readonly firstName: string,
    public readonly lastName: string,
    public readonly phone?: string
  ) {}
}

export class UpdateUserDto {
  constructor(
    public readonly firstName?: string,
    public readonly lastName?: string,
    public readonly phone?: string
  ) {}
}
```

### 2.3 Mappers

**Location:** `src/application/mappers/`

**Naming Convention:** `[EntityName].mapper.ts`

```typescript
// src/application/mappers/user.mapper.ts
import { UserEntity } from "@/domain/entities/user.entity";
import { UserDto } from "@/application/dtos/user.dto";

export class UserMapper {
  static toDto(entity: UserEntity): UserDto {
    return new UserDto(
      entity.id,
      entity.email,
      entity.firstName,
      entity.lastName,
      entity.role,
      entity.isActive,
      entity.emailVerified,
      entity.createdAt
    );
  }

  static toDtoList(entities: UserEntity[]): UserDto[] {
    return entities.map((entity) => this.toDto(entity));
  }

  static toEntity(dto: UserDto): UserEntity {
    return new UserEntity(
      dto.id,
      dto.email,
      dto.firstName,
      dto.lastName,
      dto.role as any,
      dto.isActive,
      dto.emailVerified,
      dto.createdAt,
      new Date()
    );
  }
}
```

### 2.4 Validators

**Location:** `src/application/validators/`

**Naming Convention:** `[EntityName].validator.ts`

```typescript
// src/application/validators/user.validator.ts
import { z } from "zod";

export const createUserSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(8, "Password must be at least 8 characters"),
  firstName: z.string().min(1, "First name is required"),
  lastName: z.string().min(1, "Last name is required"),
  phone: z.string().optional(),
});

export const loginUserSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(1, "Password is required"),
});

export type CreateUserInput = z.infer<typeof createUserSchema>;
export type LoginUserInput = z.infer<typeof loginUserSchema>;
```

---

## 🔸 Layer 3: Infrastructure Layer

**Location:** `src/infrastructure/`

**Purpose:** Implementations of interfaces defined in domain/application layers. External dependencies live here.

**Rules:**

- ✅ Can import from domain and application layers
- ✅ Contains framework-specific code
- ✅ Implements repository interfaces

### 3.1 Repository Implementations

**Location:** `src/infrastructure/database/repositories/`

**Naming Convention:** `[EntityName].repository.ts`

```typescript
// src/infrastructure/database/repositories/user.repository.ts
import { UserRepositoryInterface } from "@/domain/interfaces/repositories/user.repository.interface";
import { UserEntity } from "@/domain/entities/user.entity";
import { EmailValueObject } from "@/domain/value-objects/email.value-object";
import { db } from "@/infrastructure/database/drizzle/connection";
import { users } from "@/infrastructure/database/drizzle/schema";
import { eq } from "drizzle-orm";

export class DrizzleUserRepository implements UserRepositoryInterface {
  async findById(userId: string): Promise<UserEntity | null> {
    const [user] = await db
      .select()
      .from(users)
      .where(eq(users.id, userId))
      .limit(1);

    if (!user) return null;

    return this.mapToEntity(user);
  }

  async findByEmail(email: EmailValueObject): Promise<UserEntity | null> {
    const [user] = await db
      .select()
      .from(users)
      .where(eq(users.email, email.getValue()))
      .limit(1);

    if (!user) return null;

    return this.mapToEntity(user);
  }

  async findAll(): Promise<UserEntity[]> {
    const allUsers = await db.select().from(users);
    return allUsers.map((user) => this.mapToEntity(user));
  }

  async create(userEntity: UserEntity): Promise<UserEntity> {
    const [createdUser] = await db
      .insert(users)
      .values({
        id: userEntity.id,
        email: userEntity.email,
        firstName: userEntity.firstName,
        lastName: userEntity.lastName,
        role: userEntity.role,
        isActive: userEntity.isActive,
        emailVerified: userEntity.emailVerified,
      })
      .returning();

    return this.mapToEntity(createdUser);
  }

  async update(userEntity: UserEntity): Promise<UserEntity> {
    const [updatedUser] = await db
      .update(users)
      .set({
        firstName: userEntity.firstName,
        lastName: userEntity.lastName,
        isActive: userEntity.isActive,
        emailVerified: userEntity.emailVerified,
        updatedAt: new Date(),
      })
      .where(eq(users.id, userEntity.id))
      .returning();

    return this.mapToEntity(updatedUser);
  }

  async delete(userId: string): Promise<void> {
    await db.delete(users).where(eq(users.id, userId));
  }

  async existsByEmail(email: EmailValueObject): Promise<boolean> {
    const user = await this.findByEmail(email);
    return user !== null;
  }

  private mapToEntity(dbUser: any): UserEntity {
    return new UserEntity(
      dbUser.id,
      dbUser.email,
      dbUser.firstName,
      dbUser.lastName,
      dbUser.role,
      dbUser.isActive,
      dbUser.emailVerified,
      dbUser.createdAt,
      dbUser.updatedAt,
      dbUser.lastLogin
    );
  }
}
```

### 3.2 Service Implementations

**Location:** `src/infrastructure/services/`

**Naming Convention:** `[ServiceName].service.ts`

```typescript
// src/infrastructure/services/bcrypt-password-hasher.service.ts
import { PasswordHasherInterface } from "@/application/interfaces/password-hasher.interface";
import bcrypt from "bcryptjs";

export class BcryptPasswordHasherService implements PasswordHasherInterface {
  private readonly saltRounds = 10;

  async hash(plainTextPassword: string): Promise<string> {
    return bcrypt.hash(plainTextPassword, this.saltRounds);
  }

  async compare(
    plainTextPassword: string,
    hashedPassword: string
  ): Promise<boolean> {
    return bcrypt.compare(plainTextPassword, hashedPassword);
  }
}
```

### 3.3 Database Schema

**Location:** `src/infrastructure/database/drizzle/schema.ts`

Keep your Drizzle schema here (already created).

---

## 🔹 Layer 4: Presentation Layer

**Location:** `src/presentation/`

**Purpose:** Entry points for the application (API routes, web pages).

**Rules:**

- ✅ Can import from all layers
- ✅ Thin layer - just adapts requests/responses
- ✅ Dependency injection happens here

### 4.1 tRPC Routers

**Location:** `src/presentation/api/trpc/routers/`

**Naming Convention:** `[EntityName].router.ts`

```typescript
// src/presentation/api/trpc/routers/auth.router.ts
import { router, publicProcedure } from "../trpc";
import {
  createUserSchema,
  loginUserSchema,
} from "@/application/validators/user.validator";
import { SignupUserUseCase } from "@/application/use-cases/auth/signup-user.use-case";
import { LoginUserUseCase } from "@/application/use-cases/auth/login-user.use-case";
import { DrizzleUserRepository } from "@/infrastructure/database/repositories/user.repository";
import { BcryptPasswordHasherService } from "@/infrastructure/services/bcrypt-password-hasher.service";

// Dependency injection (could use a DI container)
const userRepository = new DrizzleUserRepository();
const passwordHasher = new BcryptPasswordHasherService();

export const authRouter = router({
  signup: publicProcedure
    .input(createUserSchema)
    .mutation(async ({ input }) => {
      const signupUseCase = new SignupUserUseCase(
        userRepository,
        passwordHasher
      );
      return signupUseCase.execute(input);
    }),

  login: publicProcedure.input(loginUserSchema).mutation(async ({ input }) => {
    const loginUseCase = new LoginUserUseCase(userRepository, passwordHasher);
    return loginUseCase.execute(input);
  }),
});
```

---

## 📋 Dependency Flow Rules

```
✅ Allowed Dependencies:
   Presentation → Infrastructure → Application → Domain

❌ Forbidden Dependencies:
   Domain → Application (never!)
   Domain → Infrastructure (never!)
   Domain → Presentation (never!)
   Application → Infrastructure (never!)
   Application → Presentation (never!)
```

---

## 🎯 Benefits

1. **Testability**: Test domain logic without database
2. **Flexibility**: Swap Drizzle for Prisma without touching domain
3. **Maintainability**: Clear separation of concerns
4. **Scalability**: Add features without breaking existing code
5. **Team Collaboration**: Different teams can work on different layers

---

## 📚 File Naming Summary

| Layer                | Location                                | Naming Pattern                   | Example                        |
| -------------------- | --------------------------------------- | -------------------------------- | ------------------------------ |
| Domain Entity        | `domain/entities/`                      | `[name].entity.ts`               | `user.entity.ts`               |
| Value Object         | `domain/value-objects/`                 | `[name].value-object.ts`         | `email.value-object.ts`        |
| Repository Interface | `domain/interfaces/repositories/`       | `[name].repository.interface.ts` | `user.repository.interface.ts` |
| Use Case             | `application/use-cases/`                | `[action].use-case.ts`           | `signup-user.use-case.ts`      |
| DTO                  | `application/dtos/`                     | `[name].dto.ts`                  | `user.dto.ts`                  |
| Mapper               | `application/mappers/`                  | `[name].mapper.ts`               | `user.mapper.ts`               |
| Validator            | `application/validators/`               | `[name].validator.ts`            | `user.validator.ts`            |
| Repository Impl      | `infrastructure/database/repositories/` | `[name].repository.ts`           | `user.repository.ts`           |
| Service Impl         | `infrastructure/services/`              | `[name].service.ts`              | `password-hasher.service.ts`   |
| Router               | `presentation/api/trpc/routers/`        | `[name].router.ts`               | `auth.router.ts`               |

---

## ✅ Next Steps for Migration

1. Create domain entities from current code
2. Define repository interfaces
3. Implement use cases
4. Move infrastructure code to proper locations
5. Make tRPC routers thin (just adapters)

Ready to refactor? 🚀
