import { useState, useEffect } from 'react'

let deferredPrompt;

function App() {
  const [isInstallable, setIsInstallable] = useState(false);

  useEffect(() => {
    // When brownser support pwa install function
    window.addEventListener('beforeinstallprompt', (event) => {
      // Prevent the mini-infobar from appearing on mobile.
      event.preventDefault();
      console.log('[beforeinstallprompt]', event);

      // Stash the event so it can be triggered later.
      deferredPrompt = event;

      // Remove the 'disabled' class from the install button container.
      setIsInstallable(true);
    });

    // After installed
    window.addEventListener('appinstalled', (event) => {
      console.log('[appinstalled]', event);

      // Clear the deferredPrompt so it can be garbage collected
      deferredPrompt = null;
    });
  }, []);

  const handleInstallClick = async () => {
    console.log('clicked install button');

    if (!deferredPrompt) {
      // The deferred prompt isn't available.
      return;
    }

    // Show the install prompt.
    deferredPrompt.prompt();

    // Log the result
    const result = await deferredPrompt.userChoice;
    console.log('userChoice', result);

    // Reset the deferred prompt variable, since
    // prompt() can only be called once.
    deferredPrompt = null;

    // Disable the install button.
    setIsInstallable(false);
};

  return (
    <button
      type="button"
      className={`button ${isInstallable ? '' : 'disabled'}`}
      onClick={handleInstallClick}
    >
      Install
    </button>
  )
}

export default App
