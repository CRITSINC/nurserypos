"use client";

import Layout from "../../../components/layout/Layout";

export default function Careers() {
    return (
        <Layout parent="Home" sub="Careers">
            <div className="page-content pt-50 pb-80">
                <div className="container">
                    <div className="warranty-content">
                        <p>
                            <strong>
                                If you love plants as much as we do, you may be a good fit for our company.    
                            </strong>
                        </p>

                        <p>
                            Glen Echo Nurseries is a long-established garden centre located in the heart of Caledon, Ontario. We have a proud history as a leader in the garden centre industry and we continue to grow every year.
                        </p>

                        <p>
                            We are always looking for collaborative, caring individuals who believe that they can make a positive impact with our customers and each other.
                        </p>

                        <p>
                            We invite you to submit your resume to:{" "}
                            <a
                                href="mailto:valerie@glenecho.com"
                                className="career-email"
                            >
                                valerie@glenecho.com
                            </a>
                        </p>

                        <p>
                           Please see below for current job opportunities.  
                        </p>

                    </div>

                </div>
            </div> 
        </Layout>
    );
}