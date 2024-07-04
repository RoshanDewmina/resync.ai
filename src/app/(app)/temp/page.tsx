import React from "react";
import SearchDialog from "./SearchDialog";
import IconDialog from "./IconDialog";
import reTraceWidget from "./SearchDialog";

type Props = {};

const page = (props: Props) => {
  return (
    <div>
      {" "}
      <reTraceWidget
        backdrop="blur"
        size="lg"
        isDismissable={false}
        authorization="e2a4a3b9-f514-42c6-a5d2-921f881bacb3"
        integrationId="2d053854-ba75-485a-ba46-f0847d5253cb"
        organizationDisplayName="Your Organization"
        title="Frontend Radio"
        description="Hi, What can I help you with today?"
        primaryBrandColor="#3498db"
        botAvatarLight={null} // Default to null
        botAvatarDark={null} // Default to null
        questions={["What are embeddings?", "How does AI work?"]}
        searchButtonType="iconSearch" // Choose 'searchbar', 'iconSearch', 'icon' or omit to use 'searchbar'
        classNames={{
          searchButton: "custom-search-button-class",
          closeButton: "custom-close-button-class",
          submitButton: "custom-submit-button-class",
        }}
        children={undefined}
      />
      <IconDialog />
    </div>
  );
};

export default page;
