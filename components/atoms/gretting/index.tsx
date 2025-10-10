import { useLoginCtx } from "@/store/loginContext";

const { getGreeting } = require("@davidmaziva/time-greeting");

const GreetingText = () => {
    const {userFirstName} = useLoginCtx()
      const customMessages = {
        morning: "Good Morning 🌅, {name}",
        afternoon: "Good Afternoon ☀️, {name}",
        evening: "Good Evening 🌄, {name}",
        late: "Good Night 🌙, {name}",
      };
    return getGreeting({}, {name:userFirstName,customMessages });
};

export { GreetingText };
