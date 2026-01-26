/**
 * FAQ Page
 */

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

export const metadata = {
  title: "FAQ | Val Store",
  description: "Frequently asked questions about Val Store.",
};

const faqs = [
  {
    question: "How long does shipping take?",
    answer:
      "Standard shipping takes 5-7 business days. Express shipping takes 2-3 business days. International orders take 7-14 business days.",
  },
  {
    question: "What is your return policy?",
    answer:
      "We offer a 30-day return policy for unworn items with tags attached. Simply log into your account and start a return from your order history.",
  },
  {
    question: "Do you ship internationally?",
    answer:
      "Yes! We ship to most countries worldwide. International shipping rates vary by destination and are calculated at checkout.",
  },
  {
    question: "How can I track my order?",
    answer:
      "Once your order ships, you'll receive an email with your tracking number. You can also track your order from your account dashboard.",
  },
  {
    question: "What payment methods do you accept?",
    answer:
      "We accept all major credit cards (Visa, Mastercard, American Express), PayPal, and Cash on Delivery for select regions.",
  },
  {
    question: "Can I change or cancel my order?",
    answer:
      "Orders can be modified or cancelled within 1 hour of placing them. After that, the order enters processing and cannot be changed.",
  },
  {
    question: "Do you offer gift wrapping?",
    answer:
      "Yes! Gift wrapping is available at checkout for an additional $5. You can also include a personalized message.",
  },
  {
    question: "How do I contact customer support?",
    answer:
      "You can reach us at support@valstore.com or call +1 (555) 123-4567 during business hours (Mon-Fri, 9am-6pm EST).",
  },
];

export default function FAQPage() {
  return (
    <div className="container mx-auto px-4 py-12">
      <h1 className="text-4xl font-bold mb-4">Frequently Asked Questions</h1>
      <p className="text-muted-foreground mb-8 max-w-2xl">
        Find answers to common questions about orders, shipping, returns, and
        more.
      </p>

      <Accordion type="single" collapsible className="max-w-3xl">
        {faqs.map((faq, index) => (
          <AccordionItem key={index} value={`item-${index}`}>
            <AccordionTrigger className="text-left">
              {faq.question}
            </AccordionTrigger>
            <AccordionContent className="text-muted-foreground">
              {faq.answer}
            </AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>

      <div className="mt-12 p-6 bg-muted rounded-lg max-w-3xl">
        <h2 className="text-xl font-semibold mb-2">Still have questions?</h2>
        <p className="text-muted-foreground">
          Can&apos;t find what you&apos;re looking for? Contact our support team
          at{" "}
          <a
            href="mailto:support@valstore.com"
            className="text-primary hover:underline"
          >
            support@valstore.com
          </a>
        </p>
      </div>
    </div>
  );
}
