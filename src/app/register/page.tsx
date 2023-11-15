"use client"
import { AppLayout } from "commons/AppLayout";
import React from "react";
import { RegisterForm} from "components"
import {TitleBox} from "commons"
import {ArrowLeft} from "commons"


export default function page() {
  return (
    <div>
      <AppLayout>
        <TitleBox children={"CREA TU CUENTA"} className="w-full my-2 pr-6" icon={<ArrowLeft/>}/>
        <RegisterForm/>
      </AppLayout>
    </div>
  );
}
