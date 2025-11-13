@echo off
cls

echo Eliminando base de datos y migraciones...

REM rutas relativas a la carpeta prisma
if exist prisma\dev.db (
  del /q prisma\dev.db
  echo Archivo dev.db eliminado.
) else (
  echo No existe dev.db.
)

if exist prisma\migrations (
  rmdir /s /q prisma\migrations
  echo Carpeta migrations eliminada.
) else (
  echo No existe carpeta migrations.
)

echo.
echo Instalando dependencias...
pnpm install

cls
echo Ejecutando seed...
pnpm seed

echo.
echo Iniciando servidor...
pnpm dev
