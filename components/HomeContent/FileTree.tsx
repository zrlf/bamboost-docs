import React, { useState } from 'react';

// SVG icons for folder and file
const FolderIcon = ({ isOpen }) => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d={isOpen ? "M3 7v10a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V7H10l-1-2H5a2 2 0 0 0-2 2z" : "M3 7v10a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V7H10l-1-2H5a2 2 0 0 0-2 2z"} />
  </svg>
);

const FileIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8l-6-6z" />
    <polyline points="14 2 14 8 20 8" />
  </svg>
);

const Folder = ({ name, defaultOpen, children }) => {
  const [isOpen, setIsOpen] = useState(defaultOpen);

  return (
    <div className="pl-[20px]">
      <div onClick={() => setIsOpen(!isOpen)} className="cursor-pointer flex gap-3 items-center">
        <FolderIcon isOpen={isOpen} /> {name}
      </div>
      {isOpen && <div>{children}</div>}
    </div>
  );
};

const File = ({ name }) => (
  <div className='pl-[20px] flex gap-3 items-center'>
    <FileIcon /> {name}
  </div>
);

// Usage of FileTree
const MyFileTree = ({className}) => (
  <div className={className}>
    <Folder name="bamboost database" defaultOpen>
      <Folder name="simulation_1" defaultOpen>
        <File name="simulation_1.h5" />
        <File name="additional_file.txt" />
        <File name="script.py" />
      </Folder>
      <Folder name="simulation_2" defaultOpen>
        <File name="simulation_2.h5" />
        <File name="additional_file_3.txt" />
      </Folder>
    </Folder>
  </div>
);

export default MyFileTree;
