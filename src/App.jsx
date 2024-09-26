import React, { useEffect, useState,useReducer } from "react";
import "./App.css"
import AddEditContact from "./components/AddEditContact";
import { useContacts } from "./context/ContactContext";
import { v4 as uuidv4 } from "uuid";


const initialState = {
  ADD_CONTACT: "ADD_CONTACT",
  UPDATE_CONTACT: "UPDATE_CONTACT",
  DELETE_CONTACT: "DELETE_CONTACT",
  SET_CONTACTS: "SET_CONTACTS",
};

// تابع reducer
const contactReducer = (state, action) => {
  switch (action.type) {
    case initialState.ADD_CONTACT:
      return [...state, { ...action.payload, id: uuidv4() }];
    case initialState.UPDATE_CONTACT:
      return state.map(contact =>
        contact.id === action.payload.id ? action.payload : contact
      );
    case initialState.DELETE_CONTACT:
      return state.filter(contact => contact.id !== action.payload);
    case initialState.SET_CONTACTS:
      return action.payload;
    default:
      return state;
  }
};

  

function App() {
  const [contacts, dispatch] = useReducer(contactReducer, []);
  const [modalOpen, setModalOpen] = useState(false);
  const [editContact, setEditContact] = useState(null);
  const [showCheckboxes, setShowCheckboxes] = useState(false);
  const [selectedContacts, setSelectedContacts] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
   const contactslist = useContacts();
    useEffect(() => {
      dispatch({ type: initialState.SET_CONTACTS, payload: contactslist });
    }, [contactslist]);

  // useEffect(() => {
  //   // فرض بر این است که داده‌های مخاطبین از یک منبع خارجی دریافت می‌شود
  //   const fetchContacts = async () => {
  //     const contactslist = await fetchContactsFromAPI(); // تابع فرضی برای دریافت مخاطبین
  //     dispatch({ type: actionTypes.SET_CONTACTS, payload: contactslist });
  //   };
  //   fetchContacts();
  // }, []);

  const openModal = (contact = null) => {
    setEditContact(contact);
    setModalOpen(true);
  };

  const closeModal = () => {
    setModalOpen(false);
    setEditContact(null);
  };

  const addContact = (contact) => {
    dispatch({ type: initialState.ADD_CONTACT, payload: contact });
    closeModal();
  };

  const updateContact = (updatedContact) => {
    dispatch({ type: initialState.UPDATE_CONTACT, payload: updatedContact });
    closeModal();
  };

  const deleteContact = (id) => {
    dispatch({ type: initialState.DELETE_CONTACT, payload: id });
  };
   const filteredContacts = contacts.filter((contact) =>
     contact.name.toLowerCase().includes(searchTerm.toLowerCase())
   );

  const deleteSelectedContacts = () => {
    selectedContacts.forEach((id) => {
      dispatch({ type: initialState.DELETE_CONTACT, payload: id });
    });
    setSelectedContacts([]);
    setShowCheckboxes(false);
  };

  const toggleCheckbox = (id) => {
    if (selectedContacts.includes(id)) {
      setSelectedContacts(
        selectedContacts.filter((contactId) => contactId !== id)
      );
    } else {
      setSelectedContacts([...selectedContacts, id]);
    }
  };

  return (
    <div className="container">
      <div className="form">
        <label htmlFor="name">جستجو در مخاطبین : </label>
        <input
          id="name"
          type="text"
          placeholder="جستجوی مخاطب"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <button onClick={() => openModal()}>افزودن مخاطب</button>
        <button onClick={() => setShowCheckboxes(!showCheckboxes)}>
          {showCheckboxes ? "پنهان کردن حذف گروهی" : "حذف گروهی"}
        </button>
        {showCheckboxes && (
          <button onClick={deleteSelectedContacts}>
            حذف مخاطبین انتخاب شده
          </button>
        )}
      </div>

      <div className="containerList">
        <h3>لیست مخاطبین</h3>
        {/* <ul className="contacts">
          {contacts.map((contact) => (
            <li className="item" key={contact.id}>
              {contact.name} {contact.surname} - {contact.email} -
              {contact.phone}
              <button>ویرایش</button>
              <button onClick={() => deleteContact(contact.id)}>حذف</button>
            </li>
          ))}
        </ul> */}
        <ul className="contacts">
         {filteredContacts.length > 0 ? (
          filteredContacts.map((contact) => (
            <li className="item" key={contact.id}>
              {showCheckboxes && (
                <input
                  type="checkbox"
                  checked={selectedContacts.includes(contact.id)}
                  onChange={() => toggleCheckbox(contact.id)}
                />
              )}
              {contact.name} {contact.surname} - {contact.email} -{" "}
              {contact.phone}
              <button onClick={() => openModal(contact)}>ویرایش</button>
              <button onClick={() => deleteContact(contact.id)}>حذف</button>
            </li>
          ))
        ):(<p>  مخاطب یافت نشد.  </p>)}
        </ul>
      </div>

      {modalOpen && (
        <AddEditContact
          closeModal={closeModal}
          addContact={addContact}
          updateContact={updateContact}
          editContact={editContact}
        />
      )}
    </div>
  );
}


export default App;
