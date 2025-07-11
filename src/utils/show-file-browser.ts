/*
 * Copyright (c) Jupyter Development Team.
 * Distributed under the terms of the Modified BSD License.
 */

import { IInputModel } from '@jupyter/chat';
import { ContentsManager } from '@jupyterlab/services';

/**
 * Opens a modal file browser and updates the inputModel with the selected file path.
 */
export async function showFileBrowserModal(
  inputModel: IInputModel
): Promise<void> {
  const contents = new ContentsManager();

  return new Promise(resolve => {
    const modal = document.createElement('div');
    modal.className = 'file-browser-modal';
    modal.innerHTML = `
      <div class="file-browser-panel">
        <h3>Select a File</h3>
        <ul class="file-list"></ul>
        <div class="button-row">
          <button class="back-btn">Back</button>
          <button class="close-btn">Close</button>
        </div>
      </div>
    `;
    document.body.appendChild(modal);

    const fileList = modal.querySelector('.file-list')!;
    const closeBtn = modal.querySelector('.close-btn') as HTMLButtonElement;
    const backBtn = modal.querySelector('.back-btn') as HTMLButtonElement;
    let currentPath = '';

    const listDir = async (path = '') => {
      try {
        const dir = await contents.get(path, { content: true });
        fileList.innerHTML = '';

        for (const item of dir.content) {
          const li = document.createElement('li');
          if (item.type === 'directory') {
            li.textContent = `${item.name}/`;
            li.className = 'directory';
          } else if (item.type === 'file' || item.type === 'notebook') {
            li.textContent = item.name;
            li.className = 'file';
          }

          fileList.appendChild(li);

          li.onclick = async () => {
            try {
              if (item.type === 'directory') {
                currentPath = item.path;
                await listDir(item.path);
              } else {
                const existingText = inputModel.value?.trim();
                inputModel.value = `${existingText} \`${item.path}\``.trim();
                li.style.backgroundColor = '#d2f8d2';
                document.body.removeChild(modal);
                resolve();
              }
            } catch (error) {
              console.error(error);
              document.body.removeChild(modal);
              resolve();
            }
          };
        }
      } catch (err) {
        console.error(err);
      }
    };

    closeBtn.onclick = () => {
      document.body.removeChild(modal);
      resolve();
    };

    backBtn.onclick = () => {
      if (!currentPath || currentPath === '') {
        return;
      }
      const parts = currentPath.split('/');
      parts.pop();
      currentPath = parts.join('/');
      listDir(currentPath);
    };

    listDir();
  });
}
