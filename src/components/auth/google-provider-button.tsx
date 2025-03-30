import Button from "../ui/button";

import { FaGoogle } from "react-icons/fa";

const GoogleProviderButton = () => {
  return (
    <Button variant="outline" className="my-6 w-full">
      <FaGoogle />
      Google
    </Button>
  );
};

export default GoogleProviderButton;
