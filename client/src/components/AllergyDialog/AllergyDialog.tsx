import "./AllergyDialog.css";

import {
  Flex,
  TextField,
  Text,
  Dialog,
  Button,
  IconButton,
  Box,
} from "@radix-ui/themes";
import * as Label from "@radix-ui/react-label";

import { TbRadioactiveFilled } from "react-icons/tb";
import { IoMdAdd, IoMdClose } from "react-icons/io";
import { FaChevronDown } from "react-icons/fa";
import { LiaTrashAltSolid } from "react-icons/lia";
import { useState } from "react";

interface AllergensProp {
  allergens: string[];
  value: string;
  handleInputChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleAddAllergen: () => void;
  handleUpdateAllergies: () => void;
  handleCloseDialog: () => void;
}

type List = string[];

function AllergyDialog({
  allergens,
  value,
  handleInputChange,
  handleAddAllergen,
  handleUpdateAllergies,
  handleCloseDialog,
}: AllergensProp) {
  const [isEditMode, setIsEditMode] = useState(false);
  const [allergyList, setAllergyList] = useState<List>([...allergens]);

  function handleReset() {
    setIsEditMode(false);
  }

  function handleAddToRemoveList(index: number) {
    const list = [...allergyList];
    list.splice(index, 1);
    console.log(list);
    setAllergyList([...list]);
  }

  function handleCloseButton() {
    setAllergyList([...allergens]);
    setIsEditMode(false);
    handleCloseDialog();
  }

  function handleSaveButton() {
    setIsEditMode(false);
    handleUpdateAllergies();
  }
  return (
    <Dialog.Root>
      <Flex direction="column">
        <Label.Root htmlFor="allergies" className="dialog__trigger-label">
          Allergies
        </Label.Root>
        <Dialog.Trigger className="dialog__trigger-btn">
          <Button>
            <Flex
              direction="row"
              align="center"
              className="dialog__trigger-content"
            >
              <TbRadioactiveFilled size={22} />
              <Box asChild className="dialog__trigger-text-container">
                <Text
                  className="dialog__trigger-text"
                  trim="end"
                  as="p"
                  wrap="wrap"
                >
                  {allergyList.map((allergy, index) => (
                    <>
                      {allergy}
                      {index + 1 < allergyList.length && ", "}
                    </>
                  ))}
                </Text>
              </Box>
              <FaChevronDown />
            </Flex>
          </Button>
        </Dialog.Trigger>

        {/* Dialog Content */}
        <Dialog.Content maxWidth="400px" className="dialog__content">
          <Flex align="center">
            <TbRadioactiveFilled size={22} />
            <Dialog.Title className="dialog__title">Allergies</Dialog.Title>
          </Flex>
          <Dialog.Description className="dialog__description">
            Add the allergens that aren't good to you. An icon will be shown if
            a recipe contains these allergens.
          </Dialog.Description>
          <Flex direction="column" className="dialog__textfield-container">
            <TextField.Root
              variant="surface"
              className="dialog__textfield"
              value={value}
              onChange={handleInputChange}
              onKeyUp={(k) => k.key === "Enter" && handleAddAllergen()}
            >
              <TextField.Slot className="sr-only"></TextField.Slot>
              <TextField.Slot className="dialog__textfield-add-btn">
                <IconButton onClick={handleAddAllergen}>
                  <IoMdAdd size={22} />
                </IconButton>
              </TextField.Slot>
            </TextField.Root>
            <Flex align="center" justify="between">
              <Label.Root className="dialog__content-label">
                Existing Allergies
              </Label.Root>
              {!isEditMode ? (
                <IconButton
                  className="dialog__edit-btn"
                  onClick={() => setIsEditMode(true)}
                >
                  <LiaTrashAltSolid size="20" />
                </IconButton>
              ) : (
                <Button
                  className="dialog__edit-cancel-btn"
                  variant="ghost"
                  onClick={handleReset}
                >
                  cancel
                </Button>
              )}
            </Flex>
            <Flex asChild className="dialog__content-allergy-list">
              <ul>
                {allergyList.map((allergy, index) => (
                  <Flex key={index} asChild direction="row" align="center">
                    <li
                      className={` ${isEditMode && "dialog__edit-item"}`}
                      onClick={() => {
                        if (isEditMode) {
                          handleAddToRemoveList(index);
                        }
                      }}
                    >
                      <Text key={allergy} className="dialog__content-text">
                        {allergy}
                      </Text>
                      {isEditMode && <IoMdClose size={20} />}
                    </li>
                  </Flex>
                ))}
              </ul>
            </Flex>
          </Flex>
          <Flex gap="3" mt="4" justify="end" className="dialog__content-btns">
            <Dialog.Close>
              <Button
                variant="outline"
                color="gray"
                className="dialog__content-close-btn"
                onClick={handleCloseButton}
              >
                Cancel
              </Button>
            </Dialog.Close>
            <Dialog.Close>
              <Button
                variant="solid"
                className="dialog__content-save-btn"
                onClick={handleSaveButton}
              >
                Save
              </Button>
            </Dialog.Close>
          </Flex>
        </Dialog.Content>
      </Flex>
    </Dialog.Root>
  );
}

export default AllergyDialog;
