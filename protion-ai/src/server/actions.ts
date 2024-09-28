"use server";
import { adminDb } from "@/lib/firebase/firebaseAdmin";
import { auth } from "@clerk/nextjs/server";
export async function createNewDocument() {
  auth().protect();

  const { sessionClaims } = await auth();

  const docCollectionRef = adminDb.collection("documents");

  const docRef = await docCollectionRef.add({
    title: "New Doc",
  });

  await adminDb
    .collection("users")
    .doc(sessionClaims?.email as string)
    .collection("rooms")
    .doc(docRef.id)
    .set(
      {
        userId: sessionClaims?.email as string,
        role: "owner",
        createdAt: new Date(),
        roomId: docRef.id,
      },
      { merge: true }
    );

  return { docId: docRef.id };
}

export async function deleteDocument(docId: string) {
  auth().protect();
  console.log("Deleting document", docId);

  try {
    await adminDb.collection("documents").doc(docId).delete();
    const q = await adminDb
      .collectionGroup("rooms")
      .where("roomId", "==", docId)
      .get();

    const batch = adminDb.batch();
    q.docs.forEach((doc) => {
      batch.delete(doc.ref);
    });
    await batch.commit();
    return { success: true };
  } catch (error) {
    console.log("Error deleting document", error);
    return { success: false };
  }
}

export async function inviteUserToDocument(docId: string, email: string) {
  auth().protect();

  try {
    await adminDb
      .collection("users")
      .doc(email)
      .collection("rooms")
      .doc(docId)
      .set({
        userId: email,
        role: "editor",
        createdAt: new Date(),
        roomId: docId,
      });
    return { success: true };
  } catch (error) {
    console.log("Error inviting user to document", error);
    return { success: false };
  }
}

export async function removeUserFromDoc(roomId: string, email: string) {
  auth().protect();
  console.log("Removing user from document", roomId, email);
  try {
    await adminDb
      .collection("users")
      .doc(email)
      .collection("rooms")
      .doc(roomId)
      .delete();
    return { success: true };
  } catch (error) {
    console.log("Error removing user from document", error);
    return { success: false };
  }
}
