import {
    Account,
    Avatars,
    Client,
    Databases,
    ID,
    Query,
    Storage,
  } from "react-native-appwrite";

export const appwriteConfig = {
    endpoint: "https://cloud.appwrite.io/v1",
    platform: "com.oello.beta",
    projectId: "66b35f9d002d49af5a54",
    storageId: "66b362bb003e59deb33b",
    databaseId: "66b35fcc000a81a3b252",
    userCollectionId: "66b361410031d198aea8",
    videoCollectionId: "66b3616c00015f147136",
  };

const { 
endpoint,
platform,
projectId,
storageId,
databaseId,
userCollectionId,
videoCollectionId,
} = appwriteConfig;



  // Initialize Client
    const client = new Client();

    client
    .setEndpoint(endpoint)
    .setProject(projectId)
    .setPlatform(platform)

    const account = new Account(client);
    const avatars = new Avatars(client);
    const databases = new Databases(client);


// Register User
    export async function createUser(email, password, username) {
        try {
          const newAccount = await account.create(
            ID.unique(),
            email,
            password,
            username
          )

          if(!newAccount) throw Error;

          const avatarUrl = avatars.getInitials(username);

          await signIn(email, password);

          const newUser = await databases.createDocument(
            databaseId,
            userCollectionId,
            ID.unique(),
            {
                accountId:  newAccount.$id,
                email,
                username,
                avatar: avatarUrl
            }
          )
          return newUser;

        } catch (error) {
             throw new Error(error);
            
        }
    }

    // Login User
    export async function signIn(email, password) {
        try {
            // Check for existing sessions and delete them
            const sessions = await account.listSessions();
            for (const session of sessions.sessions) {
             await account.deleteSession(session.$id);
        }
            // Create a new user session
            const session = await account.createEmailPasswordSession(email, password);

            return session; 
        } catch (error) {
            throw new Error(error);
            
        }  
    }


    // Sign Out
    export async function signOut() {
      try {
        const session = await account.deleteSession("current");

        return session;
      } catch (error) {
        throw new Error(error);
      }
    }

    // Get Account
    // export async function getAccount() {
    //     try {
    //     const currentAccount = await account.get();
    
    //     return currentAccount;
    //     } catch (error) {
    //     throw new Error(error);
    //     }
    // }


    //Get Current User
    export const getCurrentUser = async () => {
      try {
        const currentAccount = await account.get();

        if(!currentAccount) throw Error;

        const currentUser = await databases.listDocuments(
          databaseId,
          userCollectionId,
          [Query.equal('accountId', currentAccount.$id)]
        )

        if(!currentUser) throw Error;
        return currentUser.documents[0];
        
      } catch (error) {
        console.log(error);
      }
    }

export async function getAllPosts () {
  try {
    const posts = await databases.listDocuments(
      databaseId,
      videoCollectionId
    );

    return posts.documents;

  } catch (error) {
    throw new Error(error);
  }
}


export async function getLatestPosts () {
  try {
    const posts = await databases.listDocuments(
      databaseId,
      videoCollectionId,
      [Query.orderDesc("$createdAt"), Query.limit(7)]
    );

    return posts.documents;

  } catch (error) {
    throw new Error(error);
  }
}

export async function searchPosts (query) {
  try {
    const posts = await databases.listDocuments(
      databaseId,
      videoCollectionId,
      [Query.search('title', query)]
    );
    return posts.documents;

  } catch (error) {
    throw new Error(error);
  }
}


export async function getUserPosts(userId) {
  try {
    const posts = await databases.listDocuments(
      databaseId,
      videoCollectionId,
      [Query.equal('users', userId)]
    );
    return posts.documents;

  } catch (error) {
    throw new Error(error);
  }
}