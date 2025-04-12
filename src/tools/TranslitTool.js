// src/tools/TranslitTool.js
import * as React from "react";
import {
  TextField,
  Box,
  Button,
  FormLabel,
  Radio,
  RadioGroup,
  FormControl,
  FormControlLabel,
  Stack,
} from "@mui/material";
import ContentCopyIcon from "@mui/icons-material/ContentCopy";
import { XoggRune } from "../utils/xoggrune";

export default function TranslitTool({ onClose, onResult }) {
  const [selectedValue, setSelectedValue] = React.useState(
    localStorage.getItem("translitToolSelectedValue") || "beautiful"
  );
  const [inputText, setInputText] = React.useState(
    localStorage.getItem("translitToolInputText") || ""
  );
  const [outputText, setOutputText] = React.useState(
    localStorage.getItem("translitToolOutputText") || ""
  );
  const [textCopied, setTextCopied] = React.useState(false);
  const X = new XoggRune();

  const taInputRef = React.useRef(null);
  React.useEffect(() => {
    taInputRef.current?.focus();
  }, []);

  const handleCopyToClipboard = () => {
    if (!textCopied) {
      navigator.clipboard.writeText(outputText);
      setTextCopied(true);
    }
  };

  const handleInputChange = (e) => {
    setTextCopied(false);
    let txt = e.target.value;
    let output = textConvert(txt, selectedValue);
    setOutputText(output);
    setInputText(txt);
    localStorage.setItem("translitToolInputText", txt);
    localStorage.setItem("translitToolOutputText", output);
  };

  const handleRadioChange = (e) => {
    setSelectedValue(e.target.value);
    let output = textConvert(inputText, e.target.value);
    setOutputText(output);
    setTextCopied(false);
    localStorage.setItem("translitToolSelectedValue", e.target.value);
    localStorage.setItem("translitToolOutputText", output);
    taInputRef.current?.focus();
  };

  const textConvert = (text, selected_value) => {
    let script_type = selected_value.includes("beautiful") ? 1 : 2;
    let source_script_type = selected_value.includes("_") ? 2 : 0;
    let output = X.ChangeTextEncoding(text, script_type, source_script_type);
    return output;
  };

  const handleReset = () => {
    setInputText("");
    setOutputText("");
    navigator.clipboard.writeText("");
    setTextCopied(false);
    localStorage.setItem("translitToolInputText", "");
    localStorage.setItem("translitToolOutputText", "");
    taInputRef.current?.focus();
  };

  const handleInsert = () => {
    if (onResult && outputText) {
      onResult(outputText);
    }
  };

  return (
    <Box sx={{ width: 400, p: 2 }}>
      <FormLabel sx={{ fontSize: "0.875rem", color: "text.secondary", mb: 1 }}>
        Преобразование транслитерации
      </FormLabel>
      <Box sx={{ display: "flex", flexDirection: "column", gap: 1 }}>
        <TextField
          inputRef={taInputRef}
          placeholder="Текст кириллицей"
          name="taConvInput"
          minRows={2}
          size="small"
          onChange={handleInputChange}
          sx={{ width: "100%" }}
          value={inputText}
          multiline
        />
        <TextField
          placeholder="Результат"
          name="taConvOutput"
          minRows={2}
          size="small"
          variant="outlined"
          value={outputText}
          slotProps={{
            input: {
              readOnly: true,
            },
          }}
          sx={{ width: "100%" }}
          multiline
        />
        <FormControl sx={{ width: "100%" }}>
          <FormLabel sx={{ fontSize: "0.75rem" }}>Преобразовать:</FormLabel>
          <RadioGroup
            defaultValue="beautiful"
            name="radioButtonsSelectConvType"
            value={selectedValue}
            onChange={handleRadioChange}
          >
            <FormControlLabel
              value="beautiful"
              control={<Radio size="small" />}
              label="Клавиатурный > Украшенный"
              sx={{ "& .MuiFormControlLabel-label": { fontSize: "0.75rem" } }}
            />
            <FormControlLabel
              value="unicode"
              control={<Radio size="small" />}
              label="Клавиатурный > Юникод"
              sx={{ "& .MuiFormControlLabel-label": { fontSize: "0.75rem" } }}
            />
            <FormControlLabel
              value="unicode_beautiful"
              control={<Radio size="small" />}
              label="Юникод > Украшенный"
              sx={{ "& .MuiFormControlLabel-label": { fontSize: "0.75rem" } }}
            />
          </RadioGroup>
        </FormControl>
        <Stack direction="row" spacing={1} sx={{ alignItems: "center" }}>
          <Button
            size="small"
            variant="contained"
            onClick={handleCopyToClipboard}
            disabled={textCopied || inputText.length === 0}
            startIcon={<ContentCopyIcon />}
          >
            {textCopied ? "Скопировано" : "Скопировать"}
          </Button>
          <Button
            size="small"
            variant="contained"
            onClick={handleReset}
            disabled={inputText.length === 0}
          >
            Очистить
          </Button>
          <Button
            size="small"
            variant="contained"
            onClick={handleInsert}
            disabled={!outputText}
          >
            Вставить
          </Button>
          <Button size="small" variant="outlined" onClick={onClose}>
            Закрыть
          </Button>
        </Stack>
      </Box>
    </Box>
  );
}
