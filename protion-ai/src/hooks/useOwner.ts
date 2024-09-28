import { db } from "@/lib/firebase/firebaseHelper";
import { useUser } from "@clerk/nextjs";
import { useRoom } from "@liveblocks/react/suspense";
import { collectionGroup, query, where } from "firebase/firestore";
import { useEffect, useState } from "react";
import { useCollection } from "react-firebase-hooks/firestore";

function useOwner() {
  const { user } = useUser();
  const room = useRoom();
  const [isOwner, setIsOwner] = useState(false);
  const [usersInRoom] = useCollection(
    user && query(collectionGroup(db, "rooms"), where("roomId", "==", room.id))
  );

  useEffect(() => {
    if (usersInRoom?.docs && usersInRoom.docs.length > 0) {
      const owners = usersInRoom.docs.filter((d) => d.data().role === "owner");
      if (
        owners.some(
          (o) => o.data().userId === user?.emailAddresses[0].toString()
        )
      ) {
        setIsOwner(true);
      }
    }
  }, [usersInRoom, user]);

  return isOwner;
}

export default useOwner;
