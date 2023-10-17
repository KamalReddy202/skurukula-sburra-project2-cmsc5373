import * as Elements from './elements.js'
import * as protectedView from './protected_view.js'
import { currentUser } from '../controller/firebase_auth.js'
import * as Constants from '../model/constants.js';
import { getGameHistoryList,deleteAllDocs } from '../controller/firestore_controller.js'

export async function historyPageView() {
    if (!currentUser) {
        Elements.root.innerHTML = protectedView.html;
        return;
    }

    let html;
    const res = await fetch('/view/templates/history_page_template.html', { cache: 'no-store' });
    html = await res.text();
    Elements.root.innerHTML = html;

    document.getElementById('clrBtn').addEventListener('click', async () => {
        if(confirm("Are you sure to delete all game history?")) {
            await deleteAllDocs();
            historyPageView();
        }
    });

    let history = await getGameHistoryList();
    buildHistoryTable(history);
}

async function buildHistoryTable(history) {
    let html = '';
    try {
        if (history.length == 0) {
            html += '<tr><td colspan="5"><h3 style="color:red">No Game play history found!</h3></td></tr>';
            updateTable(html)
            return;
        }

        for (let i = 0; i < history.length; i++) {
            if(history[i].restart == true){
                history[i].bets = "App restart";
                history[i].won = "";
            }
            html += `<tr>
            <td>
                ${i+1}
            </td>
            <td>
                ${history[i].bets}
            </td>
            <td>
                ${history[i].won}
            </td>
            <td>
                ${history[i].balance}
            </td>
            <td>
                ${new Date(history[i].timestamp).toLocaleString()}
            </td>
        </tr>`;
        }

        updateTable(html);
    } catch (error) {
        if (Constants.DEV) console.log(`Error: history button `, error);
    }
}

function updateTable(html) {
    document.querySelector("tbody").innerHTML = html;
}