import Navbar from "./components/ui/Navbar";
import ImageUpload from "./components/ui/ImageUpload";
export default function App() {
  return (

      <main className="flex flex-col m-4 space-y-6 ">
        <Navbar/>
        <ImageUpload/>
      </main>


  );
}

