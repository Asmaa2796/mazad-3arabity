import style from "./SocialIcons.module.css";
import {
  IconBrandFacebook,
  IconBrandPinterest,
  IconBrandInstagram,
  IconBrandX,
  IconBrandGoogle,
} from "@tabler/icons-react";

const SocialIcons = () => {
  return (
    <div className={style.social_fixed}>
      <a href="#" className={`${style.icon} ${style.fb}`}>
        <IconBrandFacebook size={18} />
      </a>

      <a href="#" className={`${style.icon} ${style.pin}`}>
        <IconBrandPinterest size={18} />
      </a>

      <a href="#" className={`${style.icon} ${style.inst}`}>
        <IconBrandInstagram size={18} />
      </a>

      <a href="#" className={`${style.icon} ${style.x}`}>
        <IconBrandX size={18} />
      </a>

      <a href="#" className={`${style.icon} ${style.gplus}`}>
        <IconBrandGoogle size={18} />
      </a>
    </div>
  );
};

export default SocialIcons;