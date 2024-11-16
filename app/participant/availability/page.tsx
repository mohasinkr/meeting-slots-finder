import AvailabilityForm from "@/components/availability-form/form";
import Typography from "@/components/ui/typography";

const CheckAvailabilityPage = () => {
  return (
    <section className="flex items-center flex-col space-y-10">
      <Typography className="underline">Check Availability</Typography>
      <AvailabilityForm />
    </section>
  );
};

export default CheckAvailabilityPage;
