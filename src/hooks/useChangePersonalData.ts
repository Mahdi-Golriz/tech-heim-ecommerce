import { z } from "zod";
import useFetch from "./useFetch";
import { personalDataSchema } from "@/validations/personal-data-schema";
import { toast } from "sonner";

type PersonalData = z.infer<typeof personalDataSchema>;

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
    data: PersonalData,
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
