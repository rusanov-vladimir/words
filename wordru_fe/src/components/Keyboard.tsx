import React from "react";
import GameResult from "../api/core";
import Letter, { Presence } from "./Letter";

interface KeyboardProps {
    Game: GameResult
}

const RussianLetters = [["а","б","в","г","д","е"],["ж","з","и","й","к","л"],["м","н","о","п","р","с"],["т","у","ф","х","ц","ч","ш"],["щ","ъ","ы","ь","э","ю","я"]];


interface CharPresence {
    char: string,
    presense: Presence;
 }

 
const Keyboard : React.FC<KeyboardProps> = (props) => {

    const merge = (originalString:string, resultString:string) : CharPresence[]=> {
        if (originalString && resultString && originalString.length == resultString.length ) {
            console.log(originalString, resultString);
            const hz = [...originalString].map((ch,ci:number) =>
                {
                    let charPresence =  { char: ch} as CharPresence;
                    let presense = resultString[ci] == "#" 
                        ? Presence.Missing
                        : 
                        resultString[ci] == resultString[ci].toLowerCase() 
                            ? Presence.WrongPossition
                            : Presence.CorrectPosition
                    charPresence.presense = presense;
                    return charPresence;
                });
            return hz;
        }
        return []
    }
    
    const getLettersStatus = () => {
        var introducedLetters = props.Game.grounds.reduce((a,b) => a.concat(b.at(0)!), "");
        var checkedLetters = props.Game.grounds.reduce((a,b) => a.concat(b.at(1)!), "");
        console.log(`introduced: ${introducedLetters}`);
        console.log(`checked: ${checkedLetters}`);
        let mergeResult = merge(introducedLetters, checkedLetters);
        console.log(`letterStatus ${JSON.stringify(mergeResult)}`)
        return mergeResult;
    };
    const lettersStatus = getLettersStatus();

    const getPresence = (letter:string) : Presence =>
    {
        const statuses = lettersStatus?.filter((cp) => cp.char.toLocaleLowerCase() == letter.toLocaleLowerCase()).map((cp) => cp.presense);
        console.log(`statuses for ${letter}: ${JSON.stringify(statuses)}`);
        if (statuses.some(s => s == Presence.CorrectPosition))
        {
            return Presence.CorrectPosition;
        }
        if (statuses.some(s => s == Presence.WrongPossition))
        {
            return  Presence.WrongPossition;
        }
        if (statuses.some(s => s == Presence.Missing))
        {
            return  Presence.Missing;
        }
        return Presence.Empty;
    }
    
    return (
        <React.Fragment>
            {
                RussianLetters.map((row,ri) => 
                    <div key={(ri+1)*10}>{
                            row.map((l, li) => 
                                <Letter key={(ri+1)*10+(li+1)*5} Presence={getPresence(l)} Char={l}></Letter>
                            )
                        }
                    </div>
                )
            }
        </React.Fragment>
    );
}

export default Keyboard;