"use client";

import Image from "next/image";
import Link from "next/link";
import { ReactNode } from "react";

interface AuthLayoutProps {
  title: string;
  subtitle?: ReactNode;
  image?: string;
  children: ReactNode;
}

export default function AuthLayout({
  title,
  subtitle,
  image = "/assets/imgs/page/login-1.png",
  children,
}: AuthLayoutProps) {
  return (
    <div className="page-content pt-150 pb-150">
      <div className="container">
        <div className="row justify-content-center">
          <div className="col-xl-10 col-lg-11 col-md-12">

            <div className="row align-items-center">

              {/* Left Image */}
              <div className="col-lg-6 d-none d-lg-block">
                <Image
                  src={image}
                  alt={title}
                  width={500}
                  height={700}
                  className="border-radius-15"
                  priority
                />
              </div>

              {/* Right Card */}
              <div className="col-lg-6 col-md-10">

                <div className="login_wrap widget-taber-content background-white">

                  <div className="padding_eight_all bg-white">

                    <div className="heading_s1 mb-30">

                      <h1 className="mb-2">
                        {title}
                      </h1>

                      {subtitle && (
                        <p className="text-muted">
                          {subtitle}
                        </p>
                      )}

                    </div>

                    {children}

                  </div>

                </div>

              </div>

            </div>

          </div>
        </div>
      </div>
    </div>
  );
}