import InfoPage from "./InfoPage";
import { fetchAbout } from "../../Redux/Slices/contentSlice";

const AboutPage = () => <InfoPage type="about" fetchThunk={fetchAbout} />;

export default AboutPage;
