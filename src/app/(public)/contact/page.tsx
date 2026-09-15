"use client"

import { toasterError, toasterSuccess } from "@/components/core/Toaster";
import Layout from "../../../components/layout/Layout";
import { useSubmitContactMutation } from "@/redux/services/contact";
import dynamic from 'next/dynamic'
import { useState } from "react";

interface ContactForm {
    firstName: string;
    email: string;
    phone: string;
    subject: string;
    message: string;
}

const Gmap = dynamic(
    () => import('../../../components/elements/Gmap'),
    { ssr: false }
)


function Contact() {
    const [formData, setFormData] = useState<ContactForm>({
        firstName: "",
        email: "",
        phone: "",
        subject: "",
        message: "",
    });


    const [
        submitContact,
        {
            isLoading,
        },
    ] = useSubmitContactMutation();

    const handleChange = (
        e: React.ChangeEvent<
            HTMLInputElement | HTMLTextAreaElement
        >
    ) => {
        const { name, value } = e.target;

        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const handleSubmit = async (
        e: React.FormEvent<HTMLFormElement>
    ) => {
        e.preventDefault();

        try {
            await submitContact(formData).unwrap();

            toasterSuccess(
                "Your message has been sent successfully."
            );

            setFormData({
                firstName: "",
                email: "",
                phone: "",
                subject: "",
                message: "",
            });
        } catch (error: any) {
            console.error(
                "Contact form submission error:",
                error
            );

            toasterError(
                error?.data?.message ||
                "Unable to send your message. Please try again."
            );
        }
    };


    return (
        <>
            <Layout parent="Contact">
                <div className="page-content pt-50">
                    <section className="container mb-50 d-none d-md-block">
                        <div className="border-radius-15 overflow-hidden">
                            <Gmap />
                        </div>
                    </section>
                    <div className="container">
                        <div className="row">
                            <div className="col-xl-10 col-lg-12 m-auto">
                                <section className="mb-50">
                                    <div className="row mb-60">
                                        <div className="col-md-4">
                                            <h4 className="mb-15 text-brand">Shop</h4>
                                            15070 Airport Road Caledon, Ontario Canada L7C 2W7<br />
                                            <abbr title="Phone">Phone:</abbr> 905-584-9973<br />
                                            <abbr title="Email">Email: </abbr>gardencentre@glenecho.com<br />
                                            <a
                                                href="https://www.google.com/maps/search/?api=1&query=15070+Airport+Road+Caledon+Ontario+L7C+2W7"
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="btn btn-sm font-weight-bold text-white mt-20 border-radius-5 btn-shadow-brand hover-up"
                                            >
                                                <i className="fi-rs-marker mr-5"></i>
                                                View map
                                            </a>
                                        </div>
                                    </div>
                                    <div className="row">
                                        <div className="col-xl-8">
                                            <div className="contact-from-area padding-20-row-col">
                                                <h5 className="text-brand mb-10">Contact form</h5>
                                                <h2 className="mb-10">Drop Us a Line</h2>
                                                <p className="text-muted mb-30 font-sm">Your email address will not be published. Required fields are marked *</p>
                                                <form
                                                    onSubmit={handleSubmit}
                                                    className="contact-form"
                                                >

                                                    <div className="row">

                                                        {/* First Name */}
                                                        <div className="col-lg-6">
                                                            <div className="form-group">
                                                                <input
                                                                    type="text"
                                                                    name="firstName"
                                                                    placeholder="First Name *"
                                                                    value={
                                                                        formData.firstName
                                                                    }
                                                                    onChange={
                                                                        handleChange
                                                                    }
                                                                    required
                                                                />
                                                            </div>
                                                        </div>

                                                        {/* Email */}
                                                        <div className="col-lg-6">
                                                            <div className="form-group">
                                                                <input
                                                                    type="email"
                                                                    name="email"
                                                                    placeholder="Your Email *"
                                                                    value={
                                                                        formData.email
                                                                    }
                                                                    onChange={
                                                                        handleChange
                                                                    }
                                                                    required
                                                                />
                                                            </div>
                                                        </div>

                                                        {/* Phone */}
                                                        <div className="col-lg-6">
                                                            <div className="form-group">
                                                                <input
                                                                    type="tel"
                                                                    name="phone"
                                                                    placeholder="Phone"
                                                                    value={
                                                                        formData.phone
                                                                    }
                                                                    onChange={
                                                                        handleChange
                                                                    }
                                                                />
                                                            </div>
                                                        </div>

                                                        {/* Subject */}
                                                        <div className="col-lg-6">
                                                            <div className="form-group">
                                                                <input
                                                                    type="text"
                                                                    name="subject"
                                                                    placeholder="Subject *"
                                                                    value={
                                                                        formData.subject
                                                                    }
                                                                    onChange={
                                                                        handleChange
                                                                    }
                                                                    required
                                                                />
                                                            </div>
                                                        </div>

                                                        {/* Message */}
                                                        <div className="col-lg-12">
                                                            <div className="form-group">
                                                                <textarea
                                                                    name="message"
                                                                    rows={6}
                                                                    placeholder="Message *"
                                                                    value={
                                                                        formData.message
                                                                    }
                                                                    onChange={
                                                                        handleChange
                                                                    }
                                                                    required
                                                                />
                                                            </div>
                                                        </div>

                                                        {/* Submit */}
                                                        <div className="col-lg-12">
                                                            <button
                                                                type="submit"
                                                                className="btn btn-fill-out"
                                                                disabled={isLoading}
                                                            >
                                                                {isLoading
                                                                    ? "Sending..."
                                                                    : "Send message"}
                                                            </button>
                                                        </div>

                                                    </div>

                                                </form>
                                                <p className="form-messege"></p>
                                            </div>
                                        </div>
                                        <div className="col-lg-4 pl-50 d-lg-block d-none">
                                            <img className="border-radius-15 mt-50" src="assets/imgs/page/contact-2.png" alt="nest" />
                                        </div>
                                    </div>
                                </section>
                            </div>
                        </div>
                    </div>
                </div>
            </Layout>
        </>
    );
}

export default Contact;
