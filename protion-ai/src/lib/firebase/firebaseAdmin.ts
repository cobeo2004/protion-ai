import {
  initializeApp,
  getApps,
  App,
  getApp,
  cert,
  ServiceAccount,
} from "firebase-admin/app";

import { getFirestore } from "firebase-admin/firestore";

import serviceKey from "../../../firebase-service-key.json";

let app: App;

if (getApps().length === 0) {
  app = initializeApp({
    credential: cert(serviceKey as ServiceAccount),
  });
} else {
  app = getApp();
}

const adminDb = getFirestore(app);

export { adminDb };
