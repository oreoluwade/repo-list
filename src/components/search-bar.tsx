import { ReactComponent as SearchIcon } from "../svgs/search-icon.svg";

interface SearchBoxProps {
  value: string;
  onChange: (arg: React.ChangeEvent<HTMLInputElement>) => void;
  onBlur?: () => void;
  placeholder?: string;
}

const SearchBar: React.FC<SearchBoxProps> = ({
  value,
  onChange = () => {},
  onBlur = () => {},
  placeholder
}) => {
  return (
    <div className="w-1/2 border border-[2px] border-solid border-[grey] h-[50px] rounded-lg flex items-center px-4 py-[2px]">
      <SearchIcon className="cursor-pointer" />
      <div className="w-2" />
      <input
        type="search"
        value={value}
        onChange={onChange}
        onBlur={onBlur}
        placeholder={placeholder}
        className="grow px-3 text-xs border-hidden h-full outline-none"
      />
    </div>
  );
};

export default SearchBar;
