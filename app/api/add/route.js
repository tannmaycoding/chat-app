import { addDoc, collection } from "firebase/firestore";
import { db } from "@/lib/firebase";
export async function GET() {
    const add = async () => {
    await addDoc(collection(db, "test"), {
      hello: "world"
    });
  }
  await add()
  return Response.json({success: true})
}