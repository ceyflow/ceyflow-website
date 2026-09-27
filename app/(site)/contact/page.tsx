import { Suspense } from "react";
import { ContactClient } from "./ContactClient";

export const metadata = { title: "Contact us" };

export default function Contact() {
  return (
    <Suspense>
      <ContactClient />
    </Suspense>
  );
}
