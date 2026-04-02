import InfoPage from "./InfoPage";
import { fetchTerms } from "../../Redux/Slices/contentSlice";

const TermsPage = () => <InfoPage type="terms" fetchThunk={fetchTerms} />;

export default TermsPage;
