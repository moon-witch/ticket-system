<script setup lang="ts">
import {useDark} from "@vueuse/core";
import {useRoute, useRouter} from "vue-router";
import Button from '@/components/Button.vue'
import {computed, onBeforeMount, onMounted, ref, watch, type Ref} from "vue";
import Message from '@/components/TicketAreas/Message.vue'
import {useTicketStore} from "@/stores/tickets";
import { useMessageStore } from "@/stores/messages";
import { MessageTypes } from "@/helpers/MessageType";
import MessageModel from "@/models/MessageModel";

const isDark = useDark()

const route = useRoute()
const router = useRouter()

const isExpanded = ref(false);

const header = ref('')
const message = ref()
const ticketId = ref()
const message_history: Ref<MessageModel[]> = ref([])

const isNearBottom = (threshold: number) => {
  return chatBox.value.scrollHeight - chatBox.value.scrollTop - chatBox.value.clientHeight < threshold
}

const expand = (areaHeader: string) => {
  isExpanded.value = true;
  header.value = areaHeader
  if (isNearBottom(250)) {
    setTimeout(() => {
      scrollToBottom()
    }, 200)
  }
}

const updateMessages = async () => {
  message_history.value = await useMessageStore().getTicketMessages(Number(route.params.id))
  if (chatBox.value) {
    chatBox.value.scrollTop = chatBox.value.scrollHeight;
  }
  scrollToBottom()
}

const sendMessage = async () => {
  let ticketId = Number(route.params.id)
  await useMessageStore().sendMessage(new MessageModel(message.value, ticketId, MessageTypes.external))
  await updateMessages();
  message.value = ''
  isExpanded.value = false;
  scrollToBottom()
}

const chatBox = ref()
const scrollToBottom = () => {
  if (chatBox.value) {
    chatBox.value.scrollTo({
      top: chatBox.value.scrollHeight,
      behavior: 'smooth'
    });
  }
};

const scrollPosition = ref(chatBox.value ? chatBox.value.scrollTop : 0)
const showScrollBottomButton = computed(() => {
  if (chatBox.value && scrollPosition.value != chatBox.value.scrollHeight) {
    return !isNearBottom(400);
  } else {
    return false
  }
})

const ticketData = ref<Record<string,any>>({})
const allowed = ref(false)
onBeforeMount(async () => {
  const allowedTickets = useTicketStore().ticketsOfOneCustomer
  if (allowedTickets.some(ticket => String(ticket.ticket_id) === String(route.params.id))) {
    await useTicketStore().getSingleTicket(String(route.params.id))
    ticketData.value = useTicketStore().singleTicket
    allowed.value = true
    await updateMessages()
    chatBox.value.scrollTop = chatBox.value.scrollHeight;
    expand('external message')
    if (ticketData.value[0] && !ticketData.value[0].seen_by_customer) {
      await useTicketStore().updateTicketViewStatus(ticketData.value[0].ticket_id, false)
    }
  } else {
    await router.push({name: 'customerTickets'})
    allowed.value = false
  }
})

onMounted( () => {
})

watch(scrollPosition, () => {
  if (isNearBottom(250) && isExpanded.value === false) {
    expand('external message')
  }
  if (!isNearBottom(500) && isExpanded.value === true) {
    isExpanded.value = false
  }
})
</script>

<template>
  <main class="page-container" :class="{dark: isDark, invis : !allowed}">
    <div class="page-header">
      <div class="back-button">
        <Button @click="router.back()" button-type="submit" icon="pi-angle-left"/>
      </div>
      <div class="header">Ticket {{ route.params.id }} </div>
    </div>
    <div class="ticket-container">
      <div class="chat-container" :class="{expanded: isExpanded}">
        <div class="messages" ref="chatBox" @scroll="scrollPosition = chatBox.scrollTop">
          <div v-for="msg in message_history" class="message">
            <div v-if="!msg.department_id" class="customer-message">
              <Message :message="msg.content" :sender="msg.user_name" :created="msg.timestamp" :department="null" :msg-type="msg.messageType" />
            </div>
            <div v-else class="employee-message">
              <Message :message="msg.content" :sender="msg.user_name" :created="msg.timestamp" :department="null" :msg-type="msg.messageType" />
            </div>
          </div>
          <div v-if="showScrollBottomButton" @click="scrollToBottom" class="scroll-bottom">scroll to most recent</div>
        </div>
        <div class="text-box">
          <i v-show="isExpanded" @click="isExpanded = !isExpanded || isNearBottom(250)" class="pi pi-angle-down"/>
          <Transition name="appear">
            <div v-show="!isExpanded" class="action-buttons">
              <Button @click="expand('External Message')" button-type="submit" label="Send new message" />
            </div>
          </Transition>
          <Transition name="appear">
            <div v-show="isExpanded" class="text-area">
              <div class="header">New message</div>
              <textarea v-model="message" id="ticket" class="area"/>
            </div>
          </Transition>
          <Transition name="appear">
            <div v-show="isExpanded" class="send-button">
              <Button @click="sendMessage()" button-type="submit" label="Send" />
            </div>
          </Transition>
        </div>
      </div>
    </div>
  </main>
</template>

<style scoped lang="scss">
.page-container {
  color: $text-light;
  padding: 3rem;

  .page-header {
    display: flex;
    align-items: center;
    gap: 3rem;
    margin-bottom: 1rem;
    margin-left: 0.5rem;

    .header {
      font-size: $text-header;
    }
  }

  .ticket-container {
    display: flex;
    height: 95%;

    .chat-container {
      width: 100%;
      border: 1px solid $bg-light;
      border-radius: $radius-standard;
      margin: 0.5rem;
      padding: 1rem;

      .messages {
        height: 93%;
        transition: height 0.2s ease;
        border-bottom: 1px solid $bg-light;
        overflow-y: scroll;
        padding: 1rem;
        position: relative;

        .scroll-bottom {
          margin-left: 10px;
          padding: 0.25rem 0.5rem;
          background: $hover-dark;
          color: $page-bg-dark;
          font-weight: bold;
          position: sticky;
          bottom: 95%;
          left: 50%;
          transform: translateX(-50%);
          border-radius: $radius-small;
          cursor: pointer;
          width: fit-content;
        }

        .message {
          color: $text-light;
          font-size: $text;
          display: flex;
          flex-direction: column;

          .customer-message {
            align-self: start;
          }

          .employee-message {
            align-self: end;
          }
        }
      }

      .text-box {
        height: 7%;
        transition: height 0.2s ease;
        position: relative;

        i {
          position: absolute;
          top: -8px;
          left: 50%;
          transform: translateX(-50%);
          background: $page-bg-light;
          padding: 0 0.2rem;
          border-radius: $radius-standard;

          &:hover {
            cursor: pointer;
          }
        }

        .action-buttons {
          display: flex;
          justify-content: space-evenly;
          align-items: center;
          width: 100%;
          margin-top: 0.4rem;
          position: absolute;
          top: 50%;
          transform: translateY(-50%);
        }

        .text-area {
          padding: 0.5rem;
          height: 85%;

          .header {
            text-align: center;
            font-size: $text;
            padding: 0.5rem;
          }

          .area {
            width: 100%;
            height: 70%;
            resize: none;
            background: $bg-light;
            border-radius: $radius-small;
            border: none;
            font-size: $text;
            padding: 0.5rem;
            color: $text-light;

            &:focus {
              outline: 1px solid $hover-light;
            }
          }
        }

        .send-button {
          margin: 0 0.5rem;
          display: flex;
          justify-content: end;
        }
      }

      &.expanded {
        .messages {
          height: 70%;
        }
        .text-box {
          height: 30%;
        }
      }
    }
  }

  &.dark {
    color: $text-dark;

    .chat-container {
      border: 1px solid $bg-dark;

      .messages {
        border-bottom: 1px solid $bg-dark;

        .message {
          color: $text-dark;
        }
      }

      .text-box {
        i {
          background: $page-bg-dark;
        }

        .text-area {
          .area {
            background: $bg-dark;
            color: $text-dark;

            &:focus {
              outline: 1px solid $hover-dark;
            }
          }
        }
      }
    }

    .info-container {
      .customer-info {
        border: 1px solid $bg-dark;
      }

      .ticket-info {
        border: 1px solid $bg-dark;
      }
    }
  }
}

.invis {
  visibility: hidden;
}


.appear-enter-active,
.appear-leave-active {
  transition: opacity 0.2s ease;
}

.appear-enter-from,
.appear-leave-to {
  opacity: 0;
}
</style>