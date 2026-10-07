"use client";

import { useState } from "react";

import Sidebar from "./Sidebar";
import Header from "./Header";

export default function MainLayout({
  children,
}: {
  children: React.ReactNode;
}) {

  const [
    mobileSidebarOpen,
    setMobileSidebarOpen
  ] = useState(false);


  return (
    <div
      className="
        flex
        h-screen
        overflow-hidden
      "
    >

      {/* =====================================================
          SIDEBAR
          ===================================================== */}

      <Sidebar
        mobileOpen={
          mobileSidebarOpen
        }
        onClose={() =>
          setMobileSidebarOpen(false)
        }
      />


      {/* =====================================================
          MAIN
          ===================================================== */}

      <div
        className="
          flex
          min-w-0
          flex-1
          flex-col
          overflow-hidden
        "
      >

        <Header />


        <main
          className="
            flex-1
            overflow-y-auto
            bg-slate-100
            p-2
          "
        >

          {/* =================================================
              MOBILE MENU BUTTON
              ================================================= */}

          <div
            className="
              mb-3
              flex
              md:hidden
            "
          >

            <button
              type="button"
              onClick={() =>
                setMobileSidebarOpen(true)
              }
              className="
                flex
                h-10
                w-10
                items-center
                justify-center
                rounded-lg
                border
                border-slate-200
                bg-white
                text-slate-700
                shadow-sm
                hover:bg-slate-50
              "
              aria-label="Mở menu"
            >

              {/* 3 gạch ngang */}

              <span
                className="
                  flex
                  flex-col
                  gap-1
                "
              >
                <span
                  className="
                    block
                    h-0.5
                    w-5
                    rounded
                    bg-slate-700
                  "
                />

                <span
                  className="
                    block
                    h-0.5
                    w-5
                    rounded
                    bg-slate-700
                  "
                />

                <span
                  className="
                    block
                    h-0.5
                    w-5
                    rounded
                    bg-slate-700
                  "
                />
              </span>

            </button>

          </div>


          {children}

        </main>

      </div>

    </div>
  );
}