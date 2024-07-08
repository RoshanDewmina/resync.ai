import React from 'react';
import { ResyncWidget } from './resync';

function App() {
  const authorization = '884fef34-4c00-4d85-9a29-21adf9621523';
  const integrationId = '76882c33-61b7-460d-88b8-260cce563643';

  const customClassNames = {
    button: 'text-white',
    card: 'custom-card-class',
    cardHeader: 'custom-card-header-class',
    cardBody: 'custom-card-body-class',
    searchButton: 'custom-search-button-class',
    closeButton: 'custom-close-button-class',
    submitButton: 'custom-submit-button-class',
  };

  return (
    <div className="App">
      <ResyncWidget
        authorization={authorization}
        integrationId={integrationId}
        guidance="Custom guidance text"
        context="Custom context"
        role="user"
        tags={['tag1', 'tag2']}
        title="Custom Title"
        description="Custom Description"
        primaryBrandColor="#123456"
        searchButtonType="searchBar"
        classNames={customClassNames}
      />

<ResyncWidget
        authorization={authorization}
        integrationId={integrationId}
        guidance="Custom guidance text"
        context="Custom context"
        role="user"
        tags={['tag1', 'tag2']}
        title="Custom Title"
        description="Custom Description"
        primaryBrandColor="#123456"
        botAvatarLight={<div>Light Avatar</div>}
        botAvatarDark={<div>Dark Avatar</div>}
        questions={['What are embeddings?', 'How does OpenAI work?']}
        searchButtonType="iconText"
        classNames={customClassNames}
      />

<ResyncWidget
        authorization={authorization}
        integrationId={integrationId}
        guidance="Custom guidance text"
        context="Custom context"
        role="user"
        tags={['tag1', 'tag2']}
        title="Custom Title"
        description="Custom Description"
        // primaryBrandColor=""
        botAvatarLight={<div>Light Avatar</div>}
        botAvatarDark={<div>Dark Avatar</div>}
        questions={['What are embeddings?', 'How does OpenAI work?']}
        searchButtonType="icon"
        classNames={customClassNames}
      />
    </div>
  );
}

export default App;
