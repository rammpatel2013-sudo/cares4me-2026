@echo off
echo. | ssh-keygen -t ed25519 -C "cares4me-deploy" -f %USERPROFILE%\.ssh\id_ed25519_cares4me
echo.
echo SSH key generated! Your public key is:
echo.
type %USERPROFILE%\.ssh\id_ed25519_cares4me.pub
echo.
echo Copy the above key (starting with ssh-ed25519) to add to DigitalOcean