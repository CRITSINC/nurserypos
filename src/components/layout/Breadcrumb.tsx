import Link from "next/link";

interface BreadcrumbProps {
  parent: string;
  parent_link?: string; 
  sub?: string;
  subChild?: string;
  noBreadcrumb?: string;
}

const Breadcrumb = ({
  parent,
  parent_link = "/",
  sub,
  subChild,
  noBreadcrumb,
}: BreadcrumbProps) => {
  return (
    <div className={`page-header breadcrumb-wrap ${noBreadcrumb ?? ""}`}>
      <div className="container">
        <div className="breadcrumb">
          <Link href={parent_link}>{parent}</Link>

          {sub && (
            <>
              <span></span> {sub}
            </>
          )}

          {subChild && (
            <>
              <span></span> {subChild}
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default Breadcrumb;