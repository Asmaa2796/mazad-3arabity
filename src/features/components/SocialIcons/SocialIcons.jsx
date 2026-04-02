import style from "./SocialIcons.module.css";
import { useSelector } from "react-redux";
import {
  IconBrandFacebook,
  IconBrandInstagram,
  IconBrandX,
  IconBrandYoutube,
  IconBrandTiktok,
  IconBrandLinkedin,
} from "@tabler/icons-react";

const SocialIcons = () => {
  const settings = useSelector((state) => state.content.settings.data);
  const links = [
    { href: settings?.facebook, className: style.fb, icon: <IconBrandFacebook size={18} /> },
    { href: settings?.instagram, className: style.inst, icon: <IconBrandInstagram size={18} /> },
    { href: settings?.xUrl, className: style.x, icon: <IconBrandX size={18} /> },
    { href: settings?.youtube, className: style.gplus, icon: <IconBrandYoutube size={18} /> },
    { href: settings?.tiktok, className: style.pin, icon: <IconBrandTiktok size={18} /> },
    { href: settings?.linkedin, className: style.fb, icon: <IconBrandLinkedin size={18} /> },
  ].filter((item) => Boolean(item.href));

  return (
    <div className={style.social_fixed}>
      {links.map((item, idx) => (
        <a key={`${item.href}-${idx}`} href={item.href} target="_blank" rel="noreferrer" className={`${style.icon} ${item.className}`}>
          {item.icon}
        </a>
      ))}
    </div>
  );
};

export default SocialIcons;