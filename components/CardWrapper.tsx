"use client";

import React from "react";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import CardHeaders from "@/components/CardHeaders";
import Social from "@/components/auth/Social";
import BackButton from "@/components/BackButton";

type CardWrapperProps = {
  children: React.ReactNode;
  headerLabel: string;
  backButtonLabel: string;
  backButtonHref: string;
  showSocialMedia: boolean;
};

const CardWrapper = ({
  children,
  headerLabel,
  backButtonLabel,
  backButtonHref,
  showSocialMedia,
}: CardWrapperProps) => {
  return (
    <Card className="w-full px-5 md:w-[400px] lg:px-0">
      <CardHeader>
        <CardHeaders label={headerLabel} />
      </CardHeader>
      <CardContent>{children}</CardContent>
      {showSocialMedia && (
        <CardFooter>
          <Social />
        </CardFooter>
      )}
      <CardFooter>
        <BackButton label={backButtonLabel} href={backButtonHref} />
      </CardFooter>
    </Card>
  );
};

export default CardWrapper;
