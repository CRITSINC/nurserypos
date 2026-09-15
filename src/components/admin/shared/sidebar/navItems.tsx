import { MdOutlineDashboard } from "react-icons/md";
import { LuColumns2, LuUsers } from "react-icons/lu";
import { TbTruckDelivery } from "react-icons/tb";
import { RiCoupon2Line } from "react-icons/ri";
import { TbTag } from "react-icons/tb";
import { TbBriefcase } from "react-icons/tb";
import { MdOutlineShoppingCart } from "react-icons/md";
import { FaTags } from "react-icons/fa";
import { FaBullseye, FaCertificate, FaCircleUser } from "react-icons/fa6";
import { Settings } from "lucide-react";
import { BsArchiveFill } from "react-icons/bs";
import { PiFlagBannerFill } from "react-icons/pi";

export const navItems = [
  {
    title: "Dashboard",
    url: "/admin",
    icon: <MdOutlineDashboard />,
  },
    {
    title: "Vendors",
    url: "/admin/vendors",
    icon: <FaBullseye />,
  },
  {
    title: "Categories",
    url: "/admin/categories",
    icon: <LuColumns2 />,
  },
  {
    title: "Products",
    url: "/admin/products",
    icon: <MdOutlineShoppingCart />,
  },
  {
    title: "Tags",
    url: "/admin/tags",
    icon: <FaTags />,
  },
  {
    title: "Brands",
    url: "/admin/brands",
    icon: <FaCertificate />,
  },
  {
    title: "Inventory",
    url: "/admin/inventory",
    icon: <BsArchiveFill />,
  }, 
  {
    title: "Customers",
    url: "/admin/customers",
    icon: <FaCircleUser />,
  }, 
  {
    title: "Orders",
    url: "/admin/orders",
    icon: <TbTruckDelivery />,
  },
  {
    title: "Banner Management",
    url: "/admin/banner-management",
    icon: <PiFlagBannerFill />,
  }, 
  {
    title: "Settings",
    url: "/admin/settings",
    icon: <Settings />,
  },
];
