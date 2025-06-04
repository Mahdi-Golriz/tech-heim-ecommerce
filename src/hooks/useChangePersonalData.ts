import useFetch from "./useFetch";

import { toast } from "sonner";
import { PersonalDataSchema } from "@/validations/get-personal-data-schema";

const useChangePersonalData = () => {
  const { data, fetchData: changePersonalData } = useFetch({
    method: "PUT",
    autoFetch: false,
    skipRequestIfNoToken: true,
    onSuccess: () => {
      toast.success("Profile updated successfully!");
    },
    onError: (error) => {
      toast.error("Failed to update profile. Please try again.");
      console.error("Update error:", error);
    },
  });

  const handleChangePersonalData = async (
    data: PersonalDataSchema,
    userId: number
  ) => {
    await changePersonalData({
      path: `/api/users/${userId}`,
      body: data,
    });
  };

  return { handleChangePersonalData, data };
};

export default useChangePersonalData;
