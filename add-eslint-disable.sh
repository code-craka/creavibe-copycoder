#!/bin/bash

# Add eslint-disable comments to app/actions/api-tokens.ts
sed -i '' 's/  } catch (_error) {/  \/\/ eslint-disable-next-line @typescript-eslint\/no-unused-vars\n  } catch (_error) {/g' app/actions/api-tokens.ts

# Add eslint-disable comments to app/api-keys/client.tsx
sed -i '' 's/    } catch (_error) {/    \/\/ eslint-disable-next-line @typescript-eslint\/no-unused-vars\n    } catch (_error) {/g' app/api-keys/client.tsx

# Add eslint-disable comments to app/dashboard/page.tsx
sed -i '' 's/  } catch (_err) {/  \/\/ eslint-disable-next-line @typescript-eslint\/no-unused-vars\n  } catch (_err) {/g' app/dashboard/page.tsx

# Add eslint-disable comments to app/login/page.tsx and app/signup/page.tsx
sed -i '' 's/  const _error = resolvedParams.error/  \/\/ eslint-disable-next-line @typescript-eslint\/no-unused-vars\n  const _error = resolvedParams.error/g' app/login/page.tsx
sed -i '' 's/  const _error = resolvedParams.error/  \/\/ eslint-disable-next-line @typescript-eslint\/no-unused-vars\n  const _error = resolvedParams.error/g' app/signup/page.tsx

# Add eslint-disable comments to components/api-keys/create-token.tsx
sed -i '' 's/    } catch (_error) {/    \/\/ eslint-disable-next-line @typescript-eslint\/no-unused-vars\n    } catch (_error) {/g' components/api-keys/create-token.tsx

# Add eslint-disable comments to components/auth/email-form.tsx
sed -i '' 's/    } catch (_error) {/    \/\/ eslint-disable-next-line @typescript-eslint\/no-unused-vars\n    } catch (_error) {/g' components/auth/email-form.tsx

# Add eslint-disable comments to components/auth/social-buttons.tsx
sed -i '' 's/    } catch (_error) {/    \/\/ eslint-disable-next-line @typescript-eslint\/no-unused-vars\n    } catch (_error) {/g' components/auth/social-buttons.tsx

# Add eslint-disable comments to components/dashboard/add-project-dialog.tsx
sed -i '' 's/      const { data: _data, error } = await createProject(formData)/      \/\/ eslint-disable-next-line @typescript-eslint\/no-unused-vars\n      const { data: _data, error } = await createProject(formData)/g' components/dashboard/add-project-dialog.tsx
sed -i '' 's/    } catch (_error) {/    \/\/ eslint-disable-next-line @typescript-eslint\/no-unused-vars\n    } catch (_error) {/g' components/dashboard/add-project-dialog.tsx

# Add eslint-disable comments to components/dashboard/delete-project-dialog.tsx
sed -i '' 's/    } catch (_error) {/    \/\/ eslint-disable-next-line @typescript-eslint\/no-unused-vars\n    } catch (_error) {/g' components/dashboard/delete-project-dialog.tsx
