import React, { useState } from "react";
import {
  Modal,
  View,
  Text,
  TextInput,
  Pressable,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  TouchableWithoutFeedback,
  Keyboard,
} from "react-native";
import { icons } from "@/constants/icons";
import dayjs from "dayjs";
import clsx from "clsx";

const CATEGORIES = [
  "Entertainment",
  "AI Tools",
  "Developer Tools",
  "Design",
  "Productivity",
  "Cloud",
  "Music",
  "Other",
];

const CATEGORY_COLORS: Record<string, string> = {
  Entertainment: "#8fd1bd",
  "AI Tools": "#b8d4e3",
  "Developer Tools": "#e8def8",
  Design: "#f5c542",
  Productivity: "#ea7a53",
  Cloud: "#b8e8d0",
  Music: "#16a34a",
  Other: "#081126",
};

const CreateSubscriptionModal = ({
  visible,
  onClose,
  onSubmit,
}: CreateSubscriptionModalProps) => {
  const [name, setName] = useState("");
  const [price, setPrice] = useState("");
  const [frequency, setFrequency] = useState<"Monthly" | "Yearly">("Monthly");
  const [category, setCategory] = useState("Entertainment");

  const resetForm = () => {
    setName("");
    setPrice("");
    setFrequency("Monthly");
    setCategory("Entertainment");
  };

  const handleClose = () => {
    resetForm();
    onClose();
  };

  const isFormValid = name.trim() !== "" && parseFloat(price) > 0;

  const handleSubmit = () => {
    if (!isFormValid) return;

    const priceNum = parseFloat(price);
    const startDate = dayjs().toISOString();
    const renewalDate = dayjs()
      .add(1, frequency === "Monthly" ? "month" : "year")
      .toISOString();

    const newSubscription: Subscription = {
      id: Math.random().toString(36).substring(7),
      name: name.trim(),
      price: priceNum,
      frequency,
      billing: frequency,
      category,
      status: "active",
      startDate,
      renewalDate,
      icon: icons.wallet,
      color: CATEGORY_COLORS[category] || "#081126",
      currency: "USD",
    };

    onSubmit(newSubscription);
    handleClose();
  };

  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent={true}
      onRequestClose={handleClose}
    >
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <View className="modal-overlay">
          <KeyboardAvoidingView
            behavior={Platform.OS === "ios" ? "padding" : "height"}
            className="flex-1 justify-end"
          >
            <View className="modal-container">
              {/* Header */}
              <View className="modal-header">
                <Text className="modal-title">New Subscription</Text>
                <Pressable onPress={handleClose} className="modal-close">
                  <Text className="modal-close-text">×</Text>
                </Pressable>
              </View>

              <ScrollView
                className="modal-body"
                showsVerticalScrollIndicator={false}
              >
                {/* Name Field */}
                <View className="auth-field">
                  <Text className="auth-label">Subscription Name</Text>
                  <TextInput
                    className="auth-input"
                    placeholder="e.g. Netflix"
                    value={name}
                    onChangeText={setName}
                  />
                </View>

                {/* Price Field */}
                <View className="auth-field mt-4">
                  <Text className="auth-label">Monthly Price ($)</Text>
                  <TextInput
                    className="auth-input"
                    placeholder="0.00"
                    keyboardType="decimal-pad"
                    value={price}
                    onChangeText={setPrice}
                  />
                </View>

                {/* Frequency Field */}
                <View className="auth-field mt-4">
                  <Text className="auth-label">Frequency</Text>
                  <View className="picker-row">
                    <Pressable
                      onPress={() => setFrequency("Monthly")}
                      className={clsx(
                        "picker-option",
                        frequency === "Monthly" && "picker-option-active"
                      )}
                    >
                      <Text
                        className={clsx(
                          "picker-option-text",
                          frequency === "Monthly" && "picker-option-text-active"
                        )}
                      >
                        Monthly
                      </Text>
                    </Pressable>
                    <Pressable
                      onPress={() => setFrequency("Yearly")}
                      className={clsx(
                        "picker-option",
                        frequency === "Yearly" && "picker-option-active"
                      )}
                    >
                      <Text
                        className={clsx(
                          "picker-option-text",
                          frequency === "Yearly" && "picker-option-text-active"
                        )}
                      >
                        Yearly
                      </Text>
                    </Pressable>
                  </View>
                </View>

                {/* Category Field */}
                <View className="auth-field mt-4">
                  <Text className="auth-label">Category</Text>
                  <View className="category-scroll">
                    {CATEGORIES.map((cat) => (
                      <Pressable
                        key={cat}
                        onPress={() => setCategory(cat)}
                        className={clsx(
                          "category-chip",
                          category === cat && "category-chip-active"
                        )}
                      >
                        <Text
                          className={clsx(
                            "category-chip-text",
                            category === cat && "category-chip-text-active"
                          )}
                        >
                          {cat}
                        </Text>
                      </Pressable>
                    ))}
                  </View>
                </View>

                {/* Submit Button */}
                <View className="pb-10 pt-8">
                  <Pressable
                    onPress={handleSubmit}
                    disabled={!isFormValid}
                    className={clsx(
                      "auth-button",
                      !isFormValid && "auth-button-disabled"
                    )}
                  >
                    <Text className="auth-button-text">Add Subscription</Text>
                  </Pressable>
                </View>
              </ScrollView>
            </View>
          </KeyboardAvoidingView>
        </View>
      </TouchableWithoutFeedback>
    </Modal>
  );
};

export default CreateSubscriptionModal;
