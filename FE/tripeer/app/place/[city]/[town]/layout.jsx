import "@/app/globals.css";
import NavBar from "@/components/place/NavBar";

export const metadata = {
  title: "Tripeer | 여행 협업 플랫폼 |",
  description: "Tripeer, 트리피어 여행 협업 플랫폼 및 여행 일지 공유",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <NavBar />
        {children}
      </body>
    </html>
  );
}
