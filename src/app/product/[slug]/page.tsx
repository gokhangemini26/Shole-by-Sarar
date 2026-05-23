import { headers } from "next/headers";
import DesktopProductDetail from "@/components/DesktopProductDetail";
import MobileProductDetail from "@/components/MobileProductDetail";

export default async function ProductPage() {
  const headersList = await headers();
  const userAgent = headersList.get("user-agent") || "";
  
  // Strict mobile detection (excluding tablets/iPads which get desktop view)
  const isMobile = /Mobile|Android|iP(hone|od)|IEMobile|BlackBerry|Kindle|Silk-Accelerated|(hpw|web)OS|Opera M(obi|ini)/i.test(userAgent) && !/Tablet|iPad/i.test(userAgent);

  if (isMobile) {
    return <MobileProductDetail />;
  }
  
  return <DesktopProductDetail />;
}
