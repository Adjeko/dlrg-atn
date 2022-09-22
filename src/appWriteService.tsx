import { Models, Query } from "appwrite";
import { REPL_MODE_SLOPPY } from "repl";
import { useDLRGStore } from "./useDLRGStore";

function getProfile() {

  const appDatabase = useDLRGStore.getState().appDatabase;
  const user = useDLRGStore.getState().user;
  const setProfile = useDLRGStore.getState().setProfile;

  if (appDatabase != null && user != null) {
    appDatabase.listDocuments('63276283cb336e0e745c', [Query.equal('userId', user.$id)])
      .then(response => {
        if (response.total == 1) {
          setProfile(response.documents[0]);
        }
      });
  }
}

function getNotLoadedUser() : Models.User<Models.Preferences>{
    
  return {
    $id: '-1',
    $createdAt: -1,
    $updatedAt: -1,
    email: "",
    emailVerification: false,
    name: "notloaded",
    passwordUpdate: -1,
    phone: "",
    phoneVerification: false,
    prefs: null,
    registration: -1,
    status: false,
  }
}

export { getProfile, getNotLoadedUser }
