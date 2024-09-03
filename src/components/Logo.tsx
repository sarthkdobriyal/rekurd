import { Flex, Typography } from "antd";
import Image from "next/image";
import { useRouter } from "next/navigation";
import React, { ImgHTMLAttributes } from "react";

interface Props extends ImgHTMLAttributes<HTMLImageElement> {
  isLabel?: boolean;
}

export const Logo: React.FC<Props> = ({
  height = 50,
  isLabel = false,
  style,
  ...props
}) => {
  const router = useRouter();

  const goTo = (url: string) => {
    router.push(url);
  };

  return (
    <Flex align="center" gap={10}>
      {/* <Image
        src="/backg.jpg"
        alt={"rekurd."}
        width={32}
        height={32}
        onClick={() => goTo("/home")}
      /> */}
      {isLabel && (
        // <Typography.Title level={4} style={{ margin: '0px', color:"white" }}>
        //   outsound.
        // </Typography.Title>
        <div className="font-spartan italic text-3xl font-bold tracking-tighter">
          outsound.</div>
      )}
    </Flex>
  );
};
