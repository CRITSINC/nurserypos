"use client";

import React from "react";
import { Modal } from "react-responsive-modal";
import { useDispatch, useSelector } from "react-redux";

import { RootState } from "@/redux/store";
import {
    closeQuickView,
} from "@/redux/slices/quickView.slice";

import ProductDetails from "./ProductDetails";

export default function QuickView() {
    const dispatch = useDispatch();

    const quickView = useSelector(
        (state: RootState) => state.quickView
    );

    const handleClose = () => {
        dispatch(closeQuickView());
    };

    return (
        <Modal
            open={!!quickView}
            onClose={handleClose}
            center
            classNames={{
                modal: "quick-view-modal",
            }}
        >
            {quickView && (
                <div className="quick-view">
                    <ProductDetails
                        product={quickView}
                        quickView={true}
                    />
                </div>
            )}
        </Modal>
    );
}