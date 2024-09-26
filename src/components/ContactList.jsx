import React from "react";
import { useContacts } from "../context/ContactContext"; // مسیر صحیح را وارد کنید

const ContactList = () => {
 

  return (
    <div>
      <h2>لیست مخاطبین</h2>
      <ul>
        {contacts.map((contact) => (
          <li key={contact.id}>
            {contact.name} {contact.surname} - {contact.email} - {contact.phone}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default ContactList;
