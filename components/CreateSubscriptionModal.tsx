import React, { useState, useEffect } from "react";
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
  ActivityIndicator,
  Image,
} from "react-native";
import { icons } from "@/constants/icons";
import dayjs from "dayjs";
import clsx from "clsx";
import { usePostHog } from "posthog-react-native";

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
  const [fetchedIconUrl, setFetchedIconUrl] = useState<string | null>(null);
  const [isFetching, setIsFetching] = useState(false);
  const posthog = usePostHog();

  useEffect(() => {
    if (name.trim().length < 2) {
      setFetchedIconUrl(null);
      setIsFetching(false);
      return;
    }

    const timer = setTimeout(async () => {
      const apiKey = process.env.EXPO_PUBLIC_API_NINJAS_KEY;
      if (!apiKey) {
        console.warn("API Ninjas key missing in .env");
        return;
      }

      setIsFetching(true);
      try {
        const response = await fetch(
          `https://api.api-ninjas.com/v1/logo?name=${encodeURIComponent(name.trim())}`,
          {
            headers: { "X-Api-Key": apiKey },
          }
        );
        const data = await response.json();
        if (data && data.length > 0 && data[0].image) {
          setFetchedIconUrl(data[0].image);
        } else {
          setFetchedIconUrl(null);
        }
      } catch (error) {
        console.error("Error fetching logo:", error);
        setFetchedIconUrl(null);
      } finally {
        setIsFetching(false);
      }
    }, 800);

    return () => clearTimeout(timer);
  }, [name]);



  const resetForm = () => {
    setName("");
    setPrice("");
    setFrequency("Monthly");
    setCategory("Entertainment");
    setFetchedIconUrl(null);
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
      icon: fetchedIconUrl ? { uri: fetchedIconUrl } : icons.wallet,
      color: CATEGORY_COLORS[category] || "#081126",
      currency: "USD",
    };

    posthog.capture('subscription_created', {
      subscription_name: name.trim(),
      subscription_price: priceNum,
      subscription_frequency: frequency,
      subscription_category: category,
    });

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
                  <View className="flex-row items-center justify-between">
                    <Text className="auth-label">Subscription Name</Text>
                    {isFetching ? (
                      <ActivityIndicator size="small" color="#ea7a53" />
                    ) : fetchedIconUrl ? (
                      <View className="flex-row items-center gap-2">
                        <Text className="text-[10px] font-sans-semibold text-success uppercase">Logo Found</Text>
                        <Image 
                          source={{ uri: fetchedIconUrl }} 
                          className="size-6 rounded-md bg-white border border-border" 
                          resizeMode="contain"
                        />
                      </View>
                    ) : null}
                  </View>
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
