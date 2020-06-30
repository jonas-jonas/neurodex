import React from 'react';
import AButton from '../../atoms/AButton';
import { Modal } from '../utility/Modal';

type SettingsModalProps = {};

const SettingsModal: React.FC<SettingsModalProps> = () => {
  return (
    <>
      <Modal.Title title="Einstellungen" closeTooltip="Einstellungen schließen" />
      <div className="px-6 py-4">
        <h2 className="font-bold text-xl mb-2">Allgemein</h2>
        <div className="rounded border mb-6">
          <div className="flex justify-between items-center text-lg px-4 py-4">
            <div className="flex flex-col">
              <label className="font-bold text-lg">Sichtbarkeit</label>
              <span className="text-gray-700 text-sm">
                Dieses Modell ist <b>öffentlich</b> zugänglich
              </span>
            </div>
            <select>
              <option>Öffentlich</option>
              <option>Privat</option>
            </select>
          </div>
        </div>
        <h2 className="font-bold text-xl mb-2">Gefahrenzone</h2>
        <div className="rounded border">
          <div className="flex justify-between items-center text-lg px-4 py-4 border-b">
            <div className="flex flex-col">
              <label className="font-bold text-lg">Modell zurücksetzen</label>
              <span className="text-gray-700 text-sm">Lorem ipsum dolor sit amet, consetetur sadipscing elitr</span>
            </div>
            <AButton colorClasses="bg-error text-white hover:shadow-outline">Zurücksetzen</AButton>
          </div>
          <div className="flex justify-between items-center px-4 py-4 border-b">
            <div className="flex flex-col">
              <label className="font-bold text-lg">Modell löschen</label>
              <span className="text-gray-700 text-sm">Lorem ipsum dolor sit amet, consetetur sadipscing elitr</span>
            </div>
            <AButton colorClasses="bg-error text-white hover:shadow-outline text-lg">Löschen</AButton>
          </div>
          <div className="flex justify-between items-center text-lg px-4 py-4">
            <div className="flex flex-col">
              <label className="font-bold text-lg">Modell archivieren</label>
              <span className="text-gray-700 text-sm">
                Lorem ipsum dolor sit amet, consetetur sadipscing elitr ad asd asd
              </span>
            </div>
            <AButton colorClasses="bg-error text-white hover:shadow-outline">Archivieren</AButton>
          </div>
        </div>
      </div>
    </>
  );
};

export default SettingsModal;
