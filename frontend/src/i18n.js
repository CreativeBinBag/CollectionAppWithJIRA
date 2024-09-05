import i18n from 'i18next'
import LanguageDetector from 'i18next-browser-languagedetector'
import { initReactI18next } from 'react-i18next'; // Ensure this import is here


i18n.use(LanguageDetector).use(initReactI18next).init({
  debug: true,
  resources:{
    en: {

      translation: {

        "personalCollectionApp": "Personal Collection App",

        "topFiveLargestCollection" : "Top Five Largest Collections",

        "latestItems": "Latest Items",

        "showMore": "Show More",

        "writeAcomment": "Write a comment",

        "addComment": "Add comment",

        "updateComment": "Update Comment",

        "Login": "Log in",
        "Register": "Register",

        "english": "English",
        "bengali": "Bengali",


        //sidebar
        "admin": "Admin",
        "home": "Home",
        "manageUsers": "Manage Users",
        "manageCollections": "Manage Collections",
        "createNewCollections": "Create New Collections",
        "createJIRATicket": "JIRA Ticket Form",
        "viewJIRATicket": "JIRA Ticket List",
        "logout": "Logout",

        //users
        "userList": "Users List",
        "manageUsersofcollectionapp": "Manage users of the collection app",
        "email": "Email",
        "access": "Access",
        "actions": "Actions",
        "block": "Block",
        "unblock": "Unblock",
        "removeFromAdmin": "Remove from Admin",
        "promoteToAdmin": "Promote to Admin",
        "delete": "Delete",
        "user": "User",

        //create new collection
        "createNewCollection": "Create New Collection",
        "collectionName": "Collection Name",
        "userId": "User ID",
        "imageURLtext": "Image URL(optional)",
        "customFieldsHeader": "Custom Fields",
        "fieldType": "Field Type",
        "text": "Text",
        "number": "Number",
        "yesno": "Yes/No",
        "largeText": "Large Text",
        "date": "Date",
        "fieldState": "Field State",
        "hidden": "Hidden",
        "optional": "Optional",
        "required": "Required",
        "addCustomField": "Add Custom Field",
        "createCollection": "Create Collection",
        "1": "1",
        "2": "2",
        "3": "3",
        "4": "4",
        "5": "5",
        "6": "6",
        "7": "7",
        "8": "8",
        "9": "9",
        "10": "10",
        "11": "11",
        "12": "12",
        "13": "13",
        "14": "14",
        "15": "15",
        "customFieldName": "Custom Field",

        "cancel": "Cancel",
        "save": "Save",
        "back": "Back",
        "search": "Search",
        "username": "Username",
        "category": "Category",
        "collectionsList": "Collections List",
        "manageCollectionsofallUsers": "Manage Collections of all Users",
        "editCollectionDetails": "Edit Collection Details",
        "newItem": "New Item",
        "name": "Name",
        "actions": "Actions",
        "description": "Description",
        "createdAt": "Created At",
        "lastUpdated": "Last Updated",
        "collectionDetails": "Collection Details",
        "itemsCollectedBy": "Items collected by {{name}}",
        "itemDetails": "Item Details",
        "view": "View",
        "edit": "Edit",
        "delete": "Delete",
        "theUser": "the User",
        "editItemDetails": "Edit Item Details",
        "tags": "Tags"
      }

    },
    bn: {

      translation: {

        
        "english": "ইংরেজি",
        "bengali": "বাংলা",

        "Login": "লগ ইন",
        "Register": "রেজিস্টার",

        "topFiveLargestCollection" : "শীর্ষ পাঁচটি বৃহত্তম সংগ্রহ",

        "latestItems": "সর্বশেষ আইটেম",

        "showMore": "আরও দেখুন",

        "writeAcomment": "একটি মন্তব্য লিখুন",

        "addComment": "মন্তব্য যোগ করুন",
        "updateComment": "মন্তব্য আপডেট করুন",

         //sidebar
         "admin": "অ্যাডমিন",
         "home": "হোম",
         "manageUsers": "ব্যবহারকারী ব্যবস্থাপনা",
         "manageCollections": "সংগ্রহের ব্যবস্থাপনা",
         "createNewCollections": "নতুন সংগ্রহ যোগ করুন ",
         "createJIRATicket": "জিরা টিকিট ফর্ম",
         "viewJIRATicket": "জিরা টিকিট তালিকা",
         "logout": "লগ আউট",

        //users
        "userList": "ব্যবহারকারীর তালিকা",
        "manageUsersofcollectionapp": "সব ব্যবহারকারীর তথ্য পরিচালনা করুন",
        "email": "ইমেইল",
        "access": "প্রবেশাধিকার",
        "actions": "অ্যাকশন",
        "block": "ব্লক",
        "unblock": "আনব্লক",
        "removeFromAdmin": "অ্যাডমিন ভূমিকা থেকে সরিয়ে দিন",
        "promoteToAdmin": "অ্যাডমিন ভূমিকাতে উন্নীত করুন",
        "user": "ব্যবহারকারী",

        
          "createNewCollection": "নতুন সংগ্রহ তৈরি করুন",
          "collectionName": "সংগ্রহের নাম",
          "userId": "ব্যবহারকারীর আইডি",
          "imageURLtext": "ইমেজ URL (ঐচ্ছিক)",
          "customFieldsHeader": "কাস্টম ক্ষেত্র",
          "fieldType": "ক্ষেত্রের ধরন",
          "text": "টেক্সট",
          "number": "সংখ্যা",
          "yesno": "হ্যাঁ/না",
          "largeText": "বৃহৎ টেক্সট",
          "date": "তারিখ",
          "fieldState": "ক্ষেত্রের অবস্থা",
          "hidden": "লুকানো",
          "optional": "ঐচ্ছিক",
          "required": "আবশ্যক",
          "addCustomField": "কাস্টম ক্ষেত্র যোগ করুন",
          "createCollection": "সংগ্রহ তৈরি করুন",
          "1": "১",
          "2": "২",
          "3": "৩",
          "4": "৪",
          "5": "৫",
          "6": "৬",
          "7": "৭",
          "8": "৮",
          "9": "৯",
          "10": "১০",
          "11": "১১",
          "12": "১২",
          "13": "১৩",
          "14": "১৪",
          "15": "১৫",
          "customFieldName": "কাস্টম ক্ষেত্র",

        
        "cancel": "ক্যানসেল",
        "save": "সেভ",
        "search": "খোঁজ করুন",

 
 
        "back": "পূর্ববর্তী পৃষ্ঠায় ফিরে যান",
        "username": "ব্যবহারকারীর নাম",
        "category": "ক্যাটাগরি ",
        "collectionsList": "সংগ্রহের তালিকা",
        "manageCollectionsofallUsers": "সব ব্যবহারকারীর সংগ্রহ পরিচালনা করুন",
        "editCollectionDetails": "সংগ্রহের তথ্য এডিট করুন",
        "newItem": "নতুন আইটেম",
        "name": "নাম",
        "actions": "অ্যাকশন",
        "description": "বিবরণ",
        "createdAt": "পোস্টের তারিখ",
        "lastUpdated": "সর্বশেষ আপডেট",
        "collectionDetails": "সংগ্রহের বিবরণ",
        "itemsCollectedBy": "{{name}} এর দ্বারা সংগৃহীত আইটেম",
        "itemDetails": "আইটেম সম্পর্কে বিস্তারিত তথ্য",
        "view": "দেখুন",
        "edit": "এডিট করুন",
        "delete": "মুছুন",
        "theUser": "ব্যবহারকারী",
        "editItemDetails": "আইটেম তথ্য এডিট করুন",
        "tags": "ট্যাগ",
      }

    }
  },

  lng: "en", // default language
  fallbackLng: "en", // fallback language
  interpolation: {
    escapeValue: false // react already safes from xss
  }
  
});

export default i18n;
