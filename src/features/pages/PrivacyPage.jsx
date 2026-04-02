import InfoPage from "./InfoPage";
import { fetchPrivacy } from "../../Redux/Slices/contentSlice";

const PrivacyPage = () => <InfoPage type="privacy" fetchThunk={fetchPrivacy} />;

export default PrivacyPage;
