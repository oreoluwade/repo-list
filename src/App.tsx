import { useState } from "react";
import "./App.css";
import SearchBar from "./components/search-bar";

const App: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState("re");

  return (
    <div className="w-screen h-screen flex justify-center items-center p-10">
      <div className="flex flex-col h-full w-full">
        <SearchBar
          value={searchQuery}
          onChange={e => {
            setSearchQuery(e.target.value);
          }}
          placeholder="Start typing to search for repositories"
        />
      </div>
    </div>
  );
};

export default App;
