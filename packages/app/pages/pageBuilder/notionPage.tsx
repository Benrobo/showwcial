import { Button, Input } from "@chakra-ui/react";
import React from "react";
import Gap from "../../components/Gap";

function AddNotionPage() {
  return (
    <div className="w-full h-full">
      <div className="w-full flex flex-col items-start justify-center">
        <p className="text-white-200 font-pp-sb">Add Notion Page</p>
        <p className="text-white-300 text-[14px] font-pp-rg">
          Add a notion page which would be used for your portfolio projects.
        </p>
        <br />
      </div>
      <div className="w-full flex flex-col items-center justify-center">
        <div className="w-full flex items-start justify-start">
          {/* @ts-ignore */}
          <Input
            type="url"
            size="lg"
            placeholder="https://benrobo.notion.site/Portfolio-f8dec7f670154145a0a0dc04fd07961f"
            fontSize={"14px"}
            roundedRight="none"
            textColor={"#fff"}
          />
          <Button
            bgColor={"#4898f0"}
            textColor="#fff"
            _hover={{ bgColor: "#3F7EEE" }}
            size="lg"
            roundedLeft={"none"}
          >
            Verify Page
          </Button>
        </div>
        <div className="w-full flex flex-wrap flex-col items-start justify-start gap-4">
          {/* <VerifySection type={type} /> */}
        </div>
        <Gap height={30} />
      </div>
    </div>
  );
}

export default AddNotionPage;
